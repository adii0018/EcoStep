import dynamic from 'next/dynamic';

const LeaderboardClient = dynamic(() => import('./LeaderboardClient'), {
  ssr: false,
});export const metadata = { title: "Leaderboard | EcoStep" };
export default function LeaderboardPage() { return <LeaderboardClient />; }
