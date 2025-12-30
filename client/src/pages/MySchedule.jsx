import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MySchedule.css'; // We'll create this next

const MySchedule = () => {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/classes/myclasses`);
      setMyClasses(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Action cannot be undone. Cancel this booking?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/classes/${id}/book`);
      toast.success('Booking cancelled');
      // Update local state immediately
      setMyClasses(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      toast.error('Failed to cancel');
    }
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

  // Helper to check if a date has a class
  const getClassesForDate = (date) => {
    return myClasses.filter(cls => {
      const clsDate = new Date(cls.startTime);
      return (
        clsDate.getDate() === date.getDate() &&
        clsDate.getMonth() === date.getMonth() &&
        clsDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasClass = getClassesForDate(date).length > 0;
      return hasClass ? <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div> : null;
    }
  };

  const filteredclasses = getClassesForDate(date);
  // If no date selected (or default), could show all or just today's. 
  // Let's show selected date's classes if any, otherwise all upcoming? 
  // Actually simpler: Show ALL upcoming on the right/bottom, but filter if user clicks a date?
  // Let's stick to: Calendar highlights days. List shows ALL by default, or just the one for the selected date?
  // User asked: "when a user books a class on a specific date then that date is booked and it is marked in the calender"
  // So the marking is the most important part.

  // Let's show classes for the selected date in the list below the calendar.
  const displayClasses = filteredclasses.length > 0 ? filteredclasses : myClasses;
  // Wait, if I click a date with no classes, I want to see "No classes on this date". 
  // But initial view should probably show ALL upcoming? 
  // Let's add a "Show All" button or just default to filtering by date if the user clicks it.

  // Refined Logic: 
  // 1. Initial Load: Show ALL upcoming classes.
  // 2. User clicks date: Show classes for that date.

  // Actually, standard behavior: Select date -> Show schedule for that date.

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase">My Schedule</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-200">Calendar</h2>
              <Calendar
                onChange={setDate}
                value={date}
                tileContent={tileContent}
                className="w-full bg-transparent text-white border-0"
              />
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Booked Class</span>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {date.toDateString() === new Date().toDateString() ? "Today's Schedule" : `${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`}
              </h2>
              {/* Optional: Button to reset filter */}
            </div>

            {loading ? <p className="text-center">Loading your schedule...</p> : (
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                key={date.toISOString()} // Force re-animation on date change
              >
                {filteredclasses.length > 0 ? (
                  filteredclasses.map(cls => (
                    <motion.div
                      key={cls._id}
                      className="bg-gray-800 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center border border-gray-700 hover:border-blue-500 transition shadow-lg group"
                      variants={fadeInUp}
                    >
                      <div className="mb-4 sm:mb-0">
                        <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{cls.title}</h3>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-gray-300 font-medium">{cls.trainer}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2 flex items-center">
                          <span className="mr-2">🕒</span>
                          {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-2">|</span>
                          {cls.durationInMinutes} min
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancel(cls._id)}
                        className="px-6 py-2 bg-red-600/10 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600 hover:text-white transition font-medium w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed"
                    variants={fadeInUp}
                  >
                    <p className="text-gray-400 text-lg mb-4">No classes booked for this day.</p>
                    <a href="/classes" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25">
                      Browse Upcoming Classes
                    </a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;
