import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

const modules = [
  {
    title: 'Total Users',
    value: '124',
    trend: '+12%',
    color: 'from-blue-500 to-blue-600',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Active Plans',
    value: '8',
    trend: 'stable',
    color: 'from-purple-500 to-purple-600',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Revenue (Est)',
    value: '₹45k',
    trend: '+8%',
    color: 'from-green-500 to-emerald-600',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const AdminOverview = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-400">Here's what's happening in your gym today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {modules.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${item.color} rounded-bl-3xl`}>
              {item.icon}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                {item.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.trend.includes('+') ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                {item.trend}
              </span>
            </div>

            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{item.title}</h3>
            <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Placeholder for Recent Activity could go here */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-gray-300 text-sm">New user <span className="text-white font-medium">John Doe</span> registered.</p>
            <span className="ml-auto text-xs text-gray-500">2 mins ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <p className="text-gray-300 text-sm">New plan <span className="text-white font-medium">Gold Membership</span> created.</p>
            <span className="ml-auto text-xs text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-gray-300 text-sm">System backup completed successfully.</p>
            <span className="ml-auto text-xs text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
