import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/classes/myclasses`);
      setMyClasses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/classes/${id}/book`);
      toast.success('Booking cancelled');
      setMyClasses(myClasses.filter(c => c._id !== id));
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 uppercase">Name</label>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">Email</label>
                <p className="text-gray-300">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">Membership</label>
                <p className="text-green-400">Active Member</p>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">My Upcoming Classes</h2>
            {loading ? <p>Loading...</p> : (
              <div className="space-y-4">
                {myClasses.map(cls => (
                  <div key={cls._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                    <div>
                      <h3 className="font-bold text-lg">{cls.title}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(cls.startTime).toLocaleString()} with <span className="text-blue-400">{cls.trainer}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancel(cls._id)}
                      className="px-4 py-2 bg-red-900/50 text-red-200 rounded hover:bg-red-900 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
                {myClasses.length === 0 && (
                  <div className="text-center py-8 bg-gray-800 rounded border border-gray-700 border-dashed">
                    <p className="text-gray-400 mb-2">You haven't booked any classes yet.</p>
                    <a href="/classes" className="text-blue-400 hover:underline">Browse Schedule</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
