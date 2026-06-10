import dynamic from 'next/dynamic';

const HistoryClient = dynamic(() => import('./HistoryClient'), {
  ssr: false,
});export const metadata = { title: "Activity History | EcoStep" };
export default function HistoryPage() { return <HistoryClient />; }
