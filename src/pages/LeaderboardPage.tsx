
import Layout from '../components/Layout';
import LeaderboardTable from '../components/LeaderboardTable';

export default function LeaderboardPage() {
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Leaderboard</h1>
        <p className="text-center text-gray-600 mb-8">
          Can you make it to the top? Complete more levels to climb the ranks!
        </p>
        
        <div className="max-w-4xl mx-auto">
          <LeaderboardTable />
        </div>
      </div>
    </Layout>
  );
}
