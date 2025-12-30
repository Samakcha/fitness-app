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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/plans`);
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

      {/* Pricing Section - Redesigned as Make Your Own Membership */}
      <section id="pricing" className="py-24 bg-black relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl filter opacity-30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl filter opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Make Your Own <span className="text-red-600">Membership</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
              Customize your journey by selecting the tier that aligns with your ambition.
              Functionality meets freedom.
            </p>
          </motion.div>

          {plans.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan._id}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className={`
                    relative p-8 rounded-3xl flex flex-col transition-all duration-300
                    ${index === 1 ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-red-600 shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] scale-105 z-10' : 'bg-gray-900/50 border border-gray-800 hover:border-gray-600 hover:bg-gray-900'}
                  `}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">₹{plan.price}</span>
                      <span className="text-gray-400 font-medium">/ {plan.durationInMonths === 1 ? 'Month' : `${plan.durationInMonths} Months`}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 leading-relaxed line-clamp-2">{plan.description}</p>
                  </div>

                  <div className="flex-1 mb-8">
                    <div className="h-px w-full bg-gray-800 mb-6"></div>
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-gray-300 group">
                          <span className={`mr-3 mt-1 flex items-center justify-center w-5 h-5 rounded-full ${index === 1 ? 'bg-red-600/20 text-red-500' : 'bg-gray-800 text-gray-400 group-hover:text-white'} transition-colors`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/register"
                    className={`
                      w-full py-4 text-center rounded-xl font-bold tracking-wide transition-all duration-300
                      ${index === 1
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-600/50'
                        : 'bg-white text-black hover:bg-gray-200'}
                    `}
                  >
                    Select Capability
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
