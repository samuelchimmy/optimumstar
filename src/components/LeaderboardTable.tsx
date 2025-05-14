
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard, UserProfile } from '../lib/supabase';
import { Trophy } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardTableProps {
  currentUserId: string | null;
}

export default function LeaderboardTable({ currentUserId }: LeaderboardTableProps) {
  const [leaderboardData, setLeaderboardData] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getLeaderboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard();
        
        // Log the fetched data for debugging
        console.log('Leaderboard data fetched:', data);
        console.log('Scores:', data.map(user => ({ 
          username: user.username, 
          score: user.correct_answers,
          level: user.level,
          completed: user.quiz_completed
        })));
        
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getLeaderboardData();
  }, []);
  
  const handleRowClick = (userId: string) => {
    if (currentUserId) { // Only navigate if user is logged in
      navigate(`/user/${userId}`);
    }
  };
  
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (leaderboardData.length === 0) {
    return (
      <div className="text-center py-6 bg-secondary/10 rounded-lg">
        <p className="text-lg text-muted-foreground">No leaderboard data available yet.</p>
        <p className="text-sm">Be the first to complete the quiz!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Leaderboard shows accumulated scores from all completed levels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score (out of 50)</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            const score = user.correct_answers || 0;
            const isCompleted = user.quiz_completed;
            const maxPossibleScore = user.level && user.level > 1 ? (user.level - 1) * 10 : 50;
            
            return (
              <TableRow 
                key={user.id}
                className={`hover:bg-secondary/10 transition-colors cursor-pointer 
                  ${isCurrentUser ? 'bg-primary/5' : ''}`}
                onClick={() => handleRowClick(user.id)}
              >
                <TableCell className="font-mono">
                  {index === 0 && <Trophy className="inline mr-1 text-yellow-500 h-4 w-4" />}
                  {index === 1 && <Trophy className="inline mr-1 text-gray-400 h-4 w-4" />}
                  {index === 2 && <Trophy className="inline mr-1 text-amber-600 h-4 w-4" />}
                  {index > 2 && `#${index + 1}`}
                </TableCell>
                <TableCell className="font-semibold">
                  {user.username || 'Anonymous'}
                  {isCurrentUser && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {score}<span className="text-muted-foreground text-xs">/50</span>
                </TableCell>
                <TableCell className="text-right">
                  {isCompleted ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Level {user.level || 1}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
