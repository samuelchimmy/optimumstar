
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchLeaderboard, UserProfile } from '../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function LeaderboardTable() {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };
    
    loadLeaderboard();
  }, []);

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
              <TableRow key={player.id} className={index < 3 ? "bg-primary/5" : ""}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                  {index === 0 && " 🏆"}
                  {index === 1 && " 🥈"}
                  {index === 2 && " 🥉"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar_url} alt={player.username} />
                      <AvatarFallback>{player.username && typeof player.username === 'string' ? player.username.slice(0, 2) : '??'}</AvatarFallback>
                    </Avatar>
                    <span>{player.username}</span>
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
