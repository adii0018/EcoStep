import dynamic from 'next/dynamic';

const ProfileClient = dynamic(() => import('./ProfileClient'), {
  ssr: false,
});export const metadata = { title: "Profile | EcoStep" };
export default function ProfilePage() { return <ProfileClient />; }
