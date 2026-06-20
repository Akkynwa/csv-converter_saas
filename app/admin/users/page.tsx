// app/admin/users/page.tsx
import { getAllRegisteredUsers } from '@/lib/db/queries';

export default async function AdminUsersPage() {
  const allUsers = await getAllRegisteredUsers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Total Users: {allUsers.length}</h1>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Joined Date</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{user.name || 'N/A'}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}