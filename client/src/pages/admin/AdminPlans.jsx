import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationInMonths: '',
    features: '',
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/plans`);
      setPlans(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()), // Simple CSV parsing
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/plans`, formattedData);
      toast.success('Plan created successfully');
      setFormData({ name: '', price: '', durationInMonths: '', features: '', description: '' });
      fetchPlans();
    } catch (error) {
      toast.error('Failed to create plan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* List Plans */}
      <div className="xl:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-white mb-6">Membership Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-500/30"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-blue-400">₹{plan.price}</span>
                <span className="text-gray-500">/ {plan.durationInMonths}mo</span>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
            </motion.div>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-500">
              No active plans found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Create Form */}
      <div className="xl:col-span-1">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Create New Plan
          </h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Plan Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Gold Membership"
                className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="999"
                  className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Duration (Mo)</label>
                <input
                  type="number"
                  name="durationInMonths"
                  value={formData.durationInMonths}
                  onChange={handleChange}
                  required
                  placeholder="12"
                  className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Features</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Gym, Sauna, Pool (comma separated)"
                className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-600 mt-1">Separate independent features with commas</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                placeholder="Brief description of the plan benefits..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform active:scale-95"
            >
              Create Plan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
