import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBuildingOffice2, HiOutlineShieldCheck, HiOutlineCreditCard,
  HiOutlineChartBarSquare, HiOutlineWrenchScrewdriver, HiOutlineUserGroup,
  HiOutlineGlobeAlt, HiOutlineBolt, HiOutlineDevicePhoneMobile,
  HiOutlineCheckCircle, HiOutlineStar, HiOutlineArrowRight,
} from 'react-icons/hi2';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.45, bounce: 0 }
  }
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

const stats = [
  { label: 'Beds Managed', value: '12,000+', icon: '🛏️' },
  { label: 'Cities', value: '45+', icon: '🏙️' },
  { label: 'Happy Guests', value: '150K+', icon: '😊' },
  { label: 'Properties', value: '800+', icon: '🏠' },
];

const features = [
  {
    icon: HiOutlineBuildingOffice2,
    title: 'Property Management',
    desc: 'Manage unlimited properties with room-level inventory, pricing, and real-time availability tracking.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'KYC Verification',
    desc: 'Digital Aadhar/Passport verification workflow with automated status tracking and secure storage.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Smart Billing',
    desc: 'Pro-rata rent calculation, Stripe payments, auto-generated receipts, and electricity meter billing.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: HiOutlineChartBarSquare,
    title: 'Analytics Dashboard',
    desc: 'Revenue insights, occupancy trends, collection rates, and financial reports at a glance.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    title: 'Maintenance Desk',
    desc: 'Ticket lifecycle management — from raised to resolved with photo/video support and push alerts.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Guest Management',
    desc: 'Pre-approve visitors, generate QR codes for gate entry, and maintain night-out/leave logs.',
    color: 'from-cyan-500 to-sky-600',
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'PG Owner, Bengaluru',
    text: 'StaySync replaced my 3 registers and 5 WhatsApp groups. Revenue tracking is now automatic.',
    avatar: 'RK',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Hostel Manager, Delhi',
    text: 'The maintenance ticket system alone saved us 10 hours per week. Tenants love the app.',
    avatar: 'PS',
    rating: 5,
  },
  {
    name: 'Arjun Patel',
    role: 'Property Chain, Mumbai',
    text: 'Managing 12 properties from one dashboard changed our business. Pro-rata billing is genius.',
    avatar: 'AP',
    rating: 5,
  },
];

const AnimatedCounter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const num = parseInt(end.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end, isVisible]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-pattern dark:bg-hero-dark" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 dark:to-surface-950/80" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />

        {/* Content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <HiOutlineBolt className="w-4 h-4" />
              India's #1 PG Management Platform
            </motion.div>

            <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
              Manage Your PG
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </motion.h1>

            <motion.p variants={fadeUpVariant} className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Replace registers, WhatsApp groups, and manual tracking with a single,
              powerful dashboard. Automated billing, KYC, maintenance — all in one place.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 text-lg group"
                >
                  Start Free Trial
                  <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-colors duration-300 text-lg"
                >
                  <HiOutlineGlobeAlt className="w-5 h-5" />
                  Explore Properties
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <motion.section 
        className="relative -mt-16 z-20 max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
      >
        <div className="glass-card p-2">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-6 px-4 ${
                  i < stats.length - 1 ? 'border-r border-surface-200/50 dark:border-surface-700/50' : ''
                }`}
              >
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.value.includes('+') ? '+' : ''} />
                </span>
                <span className="text-sm text-surface-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeUpVariant} className="badge-primary text-sm mb-4 inline-block">Features</motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl lg:text-5xl font-display font-bold text-surface-900 dark:text-white mb-4">
            Everything You Need to
            <br />
            <span className="gradient-text">Run a Modern PG</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-lg text-surface-500 max-w-2xl mx-auto">
            From property listing to rent collection, maintenance to analytics — StaySync handles it all.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUpVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card-hover p-8 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-surface-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeUpVariant} className="badge-primary text-sm mb-4 inline-block">How It Works</motion.span>
            <motion.h2 variants={fadeUpVariant} className="text-3xl lg:text-5xl font-display font-bold text-surface-900 dark:text-white mb-4">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {[
              {
                step: '01',
                title: 'List Your Property',
                desc: 'Add your PG/hostel with photos, amenities, room details, and pricing.',
                icon: HiOutlineBuildingOffice2,
              },
              {
                step: '02',
                title: 'Accept Bookings',
                desc: 'Residents discover your property, book rooms, and pay securely online.',
                icon: HiOutlineDevicePhoneMobile,
              },
              {
                step: '03',
                title: 'Manage Everything',
                desc: 'Track rent, handle maintenance, verify KYC — all from your dashboard.',
                icon: HiOutlineChartBarSquare,
              },
            ].map((item, i) => (
              <motion.div 
                key={item.step} 
                className="relative text-center group"
                variants={fadeUpVariant}
              >
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{item.step}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-surface-500">{item.desc}</p>

                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 text-surface-300 dark:text-surface-600">
                    <HiOutlineArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeUpVariant} className="badge-primary text-sm mb-4 inline-block">Testimonials</motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl lg:text-5xl font-display font-bold text-surface-900 dark:text-white mb-4">
            Trusted by <span className="gradient-text">800+ Property Owners</span>
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUpVariant}
              className="glass-card p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <HiOutlineStar key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-surface-600 dark:text-surface-300 mb-6 leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-surface-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 lg:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0 }}
          >
            <div className="absolute inset-0 bg-card-shine animate-shimmer" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                Ready to Modernize Your PG Business?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join 800+ property owners who've streamlined their operations with StaySync.
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 text-lg group"
                  >
                    Get Started Free
                    <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-colors duration-300 text-lg"
                  >
                    View Demo
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SS</span>
                </div>
                <span className="text-xl font-display font-bold">StaySync</span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Premium PG & Accommodation Management for the modern era.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><Link to="/properties" className="hover:text-white transition-colors">Properties</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-500">
              © 2026 StaySync. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-surface-500">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">SSL Secured</span>
              <span className="text-surface-700">|</span>
              <span className="text-sm">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

