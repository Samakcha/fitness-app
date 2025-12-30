import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const [plans, setPlans] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/plans');
        setPlans(res.data);
      } catch (error) {
        console.error('Failed to fetch plans', error);
      }
    };
    fetchPlans();
  }, []);

  const minPrice = plans.length > 0 ? Math.min(...plans.map(p => p.price)) : 0;
  const maxPrice = plans.length > 0 ? Math.max(...plans.map(p => p.price)) : 0;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Forge Your Legacy
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the ultimate fitness evolution with world-class equipment and expert trainers.
          </motion.p>
          <motion.div variants={fadeInUp} className="space-x-4">
            {!user && (
              <Link to="/register" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition transform hover:scale-105 inline-block">
                Start Your Journey
              </Link>
            )}
            {user && (
              <Link to="/classes" className="px-8 py-4 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition transform hover:scale-105 inline-block">
                View Schedules
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold uppercase mb-4">Why Choose Us</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { title: 'Modern Equipment', desc: 'State of the art machinery for every muscle group.' },
              { title: 'Expert Trainers', desc: 'Certified professionals to guide your progress.' },
              { title: 'Flexible Schedule', desc: 'Open 24/7 because fitness never sleeps.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-8 bg-gray-800 rounded-2xl hover:bg-gray-750 transition duration-300 border border-gray-700 hover:border-red-600"
              >
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold uppercase mb-4">Membership Plans</h2>
            <p className="text-gray-400">Choose the perfect plan for your goals</p>
            {plans.length > 0 && (
              <p className="text-xl text-red-500 font-bold mt-2">
                Plans range from ₹{minPrice} to ₹{maxPrice}
              </p>
            )}
          </motion.div>
          {plans.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan._id}
                  variants={fadeInUp}
                  className="relative p-8 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col hover:border-red-600 transition duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{plan.durationInMonths} Month Access</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-red-500">₹{plan.price}</span>
                    <span className="text-gray-500"> / period</span>
                  </div>
                  <ul className="flex-1 mb-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full py-3 text-center bg-gray-800 text-white border border-gray-600 rounded-xl hover:bg-white hover:text-black transition font-bold block">
                    Select Plan
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; 2024 IronGym. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
