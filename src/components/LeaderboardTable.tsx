
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchLeaderboard, UserProfile } from '../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react'; 

interface LeaderboardTableProps {
  currentUserId: string | null;
}

export default function LeaderboardTable({ currentUserId = null }: LeaderboardTableProps) {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const maxRetries = 3;

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const data = await fetchLeaderboard();
        console.log("Leaderboard data:", data); 
        
        if (data && Array.isArray(data)) {
          setLeaderboard(data);
          setError(false);
        } else {
          console.error('Invalid leaderboard data format:', data);
          setError(true);
          
          if (retryCount >= maxRetries - 1) {
            toast({
              title: "Error",
              description: "Failed to load leaderboard data",
              variant: "destructive"
            });
          } else {
            // Try again with a delay
            setTimeout(() => setRetryCount(prev => prev + 1), 1000);
          }
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError(true);
        
        if (retryCount >= maxRetries - 1) {
          toast({
            title: "Error",
            description: "Failed to load leaderboard data",
            variant: "destructive"
          });
        } else {
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [retryCount]);

  const handleProfileClick = (playerId: string) => {
    if (!user) {
      // If not logged in, redirect to login with a helpful message
      toast({
        title: "Authentication Required",
        description: "Please login to view user profiles"
      });
      navigate('/login');
      return;
    }
    
    // Navigate to user profile
    navigate(`/user/${playerId}`);
  };

  const handleRetry = () => {
    setRetryCount(0);
    setLoading(true);
    setError(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-muted-foreground">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="text-center p-6 border border-destructive/30 rounded-md bg-destructive/10">
          <h3 className="font-semibold text-lg mb-2">Leaderboard Error</h3>
          <p className="mb-4">We couldn't load the leaderboard data. This could be due to a temporary connection issue.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/20">
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((player, index) => (
              <TableRow 
                key={player.id} 
                className={`${index < 3 ? "bg-primary/5" : ""} ${player.id === currentUserId ? "bg-secondary/20" : ""} ${user ? "cursor-pointer hover:bg-muted" : ""}`}
                onClick={() => user && handleProfileClick(player.id)}
                role={user ? "button" : undefined}
              >
                <TableCell className="font-medium text-center">
                  {index + 1}
                  {index === 0 && " 🏆"}
                  {index === 1 && " 🥈"}
                  {index === 2 && " 🥉"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar_url || ''} alt={player.username || ''} />
                      <AvatarFallback>{player.username && typeof player.username === 'string' ? player.username.slice(0, 2) : '??'}</AvatarFallback>
                    </Avatar>
                    <span className={`${player.id === currentUserId ? "font-bold" : ""} ${user ? "hover:underline" : ""}`}>
                      {player.username}
                      {player.id === currentUserId && " (You)"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{player.level}</TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">{player.correct_answers || 0}</span>
                  <span className="text-muted-foreground text-sm ml-1">/50</span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No players on the leaderboard yet. Be the first!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
