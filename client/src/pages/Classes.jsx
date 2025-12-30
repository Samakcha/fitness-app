import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/classes`);
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (id) => {
    if (!user) {
      toast.error('Please login to book a class');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/classes/${id}/book`);
      toast.success('Class booked successfully!');
      fetchClasses(); // Refresh to update capacity/booking status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const isBooked = (classItem) => {
    return user && classItem.attendees.includes(user.id);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Weekly Schedule
        </motion.h1>

        {loading ? <p className="text-center">Loading schedule...</p> : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {classes.map((cls) => (
              <motion.div
                key={cls._id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg hover:border-blue-500 transition"
                variants={fadeInUp}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{cls.title}</h3>
                    <p className="text-blue-400 text-sm">{cls.trainer}</p>
                  </div>
                  <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                    {cls.durationInMinutes} min
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="w-20 font-semibold">Time:</span>
                    {new Date(cls.startTime).toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="w-20 font-semibold">Spots:</span>
                    {cls.attendees.length} / {cls.capacity}
                  </div>
                </div>

                <button
                  onClick={() => handleBook(cls._id)}
                  disabled={isBooked(cls) || cls.attendees.length >= cls.capacity}
                  className={`w-full py-2 rounded font-bold transition ${isBooked(cls)
                    ? 'bg-green-800 text-green-200 cursor-default'
                    : cls.attendees.length >= cls.capacity
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isBooked(cls) ? 'Booked' : cls.attendees.length >= cls.capacity ? 'Full' : 'Book Class'}
                </button>
              </motion.div>
            ))}
            {classes.length === 0 && <p className="text-center col-span-full text-gray-500">No classes scheduled.</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Classes;
