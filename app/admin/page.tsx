import { redirect } from 'next/navigation';

// Admin root redirects to the users management page
export default function AdminPage() {
  redirect('/admin/users');
}
