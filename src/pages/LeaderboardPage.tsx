
import Layout from '../components/Layout';
import LeaderboardTable from '../components/LeaderboardTable';
import { useAuth } from '../contexts/AuthContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Leaderboard</h1>
        <p className="text-center text-gray-600 mb-2">
          Can you make it to the top? Complete more levels to climb the ranks!
        </p>
        {user && (
          <p className="text-center text-gray-600 mb-6">
            Click on any player to view their detailed profile.
          </p>
        )}
        
        <div className="max-w-4xl mx-auto">
          <LeaderboardTable />
        </div>
      </div>
    </Layout>
  );
}
