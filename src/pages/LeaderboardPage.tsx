
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import LeaderboardTable from '../components/LeaderboardTable';
import { useAuth } from '../contexts/AuthContext';
import { getUserRanking } from '../lib/supabase';
import { toast } from "@/hooks/use-toast";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Fetch user's rank if they're logged in
    const fetchUserRank = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          setError(false);
          
          const rank = await getUserRanking(user.id);
          setUserRank(rank);
        } catch (err) {
          console.error('Error fetching user rank:', err);
          setError(true);
          toast({
            title: "Error",
            description: "Failed to load your ranking data"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserRank();
  }, [user]);
  
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Leaderboard</h1>
        <p className="text-center text-gray-600 mb-2">
          Can you make it to the top? Complete more levels to climb the ranks!
        </p>
        <p className="text-center text-gray-600 mb-6">
          Click on any player to view their detailed profile.
        </p>
        
        {loading ? (
          <div className="text-center mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/20 text-secondary animate-pulse">
              Loading your rank...
            </span>
          </div>
        ) : (
          user && userRank !== null && userRank > 0 && (
            <div className="text-center mb-6 animate-float">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary">
                Your current rank: #{userRank}
              </span>
            </div>
          )
        )}
        
        <div className="max-w-4xl mx-auto glass p-6 rounded-xl shadow-lg animate-fade-in">
          <LeaderboardTable currentUserId={user?.id || null} />
        </div>
      </div>
    </Layout>
  );
}
