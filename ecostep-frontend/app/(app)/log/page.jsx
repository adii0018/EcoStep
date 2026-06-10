import dynamic from 'next/dynamic';

const LogPageClient = dynamic(() => import('./LogPageClient'), {
  ssr: false,
});
export const metadata = {
  title: "Log Activity | EcoStep",
  description: "Log your daily emissions from food, travel, and energy",
};

export default function LogPage() {
  return <LogPageClient />;
}
