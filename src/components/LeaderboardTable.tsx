
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard, UserProfile } from '../lib/supabase';
import { Trophy } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

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
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">Player</th>
            <th className="py-3 px-4 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <tr 
                key={user.id}
                className={`border-b hover:bg-secondary/10 transition-colors cursor-pointer 
                  ${isCurrentUser ? 'bg-primary/5' : ''}`}
                onClick={() => handleRowClick(user.id)}
              >
                <td className="py-3 px-4 font-mono">
                  {index === 0 && <Trophy className="inline mr-1 text-yellow-500 h-4 w-4" />}
                  {index === 1 && <Trophy className="inline mr-1 text-gray-400 h-4 w-4" />}
                  {index === 2 && <Trophy className="inline mr-1 text-amber-600 h-4 w-4" />}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className="py-3 px-4 font-semibold">
                  {user.username || 'Anonymous'}
                  {isCurrentUser && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>}
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {user.correct_answers || 0}<span className="text-muted-foreground text-xs">/50</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
