import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false, // Dashboard relies heavily on client-side state/cookies
});
export const metadata = {
  title: "Dashboard | EcoStep",
  description: "Track your weekly carbon footprint and get AI-powered tips",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
