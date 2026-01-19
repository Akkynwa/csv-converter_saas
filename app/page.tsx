// app/page.tsx
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import LandingPage from './(marketing)/page';

export default async function RootPage() {
  const user = await getUser();

  // If logged in, send them to the specific dashboard sub-path
  if (user) {
    redirect('/dashboard');
  }

  // If not logged in, show the landing page at the root (/)
  return <LandingPage />;
}