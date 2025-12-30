import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">User Management</h2>
          <p className="text-gray-400 mt-1">Manage users, trainers, and administrators.</p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm text-gray-400">
          Total Users: <span className="text-white font-bold ml-1">{users.length}</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : user.role === 'trainer'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleUpdateRole(user._id, 'admin')}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded border border-gray-700 transition"
                        title="Promote to Admin"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== 'trainer' && (
                      <button
                        onClick={() => handleUpdateRole(user._id, 'trainer')}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded border border-gray-700 transition"
                        title="Promote to Trainer"
                      >
                        Make Trainer
                      </button>
                    )}
                    {user.role !== 'user' && (
                      <button
                        onClick={() => handleUpdateRole(user._id, 'user')}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded border border-gray-700 transition"
                        title="Demote to Member"
                      >
                        Make Member
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
