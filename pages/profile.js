import dynamic from 'next/dynamic';

const ProfileComponent = dynamic(() => import('../components/dashboard/admin/profile'), { ssr: false });

export default function ProfilePage() {
  return <ProfileComponent />;
}