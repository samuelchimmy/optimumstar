
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchLeaderboard, UserProfile } from '../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

interface LeaderboardTableProps {
  currentUserId: string | null;
}

export default function LeaderboardTable({ currentUserId = null }: LeaderboardTableProps) {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard();
        console.log("Leaderboard data:", data); // Add logging to see what data is returned
        setLeaderboard(data || []);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">Loading leaderboard...</div>
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
                  {player.id === currentUserId && " (You)"}
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
                <TableCell className="text-right">{player.correct_answers}</TableCell>
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
