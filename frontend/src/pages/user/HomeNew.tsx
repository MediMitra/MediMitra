import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      icon: '🩺',
      title: 'Prescription Medicines',
      description: 'Comprehensive management of prescription medications through verified pharmacies and regular monitoring to ensure safe delivery.',
      link: '/medicines',
    },
    {
      icon: '💊',
      title: 'Over-The-Counter',
      description: 'Accurate testing and screening services to provide OTC medicines for common health conditions and wellness.',
      link: '/medicines',
    },
    {
      icon: '🏥',
      title: 'Home Delivery',
      description: 'One of the defining features of our service is the continuity of care with fast home delivery services.',
      link: '/medicines',
    },
    {
      icon: '⚕️',
      title: 'Expert Consultation',
      description: 'Healthcare consultation services that focus on holistic wellness, combining physical and mental health support.',
      link: '/medicines',
    },
    {
      icon: '🔬',
      title: 'Quality Assurance',
      description: 'All medicines undergo strict quality checks and are sourced from certified manufacturers and pharmacies.',
      link: '/medicines',
    },
    {
      icon: '💝',
      title: 'Customer Care',
      description: '24/7 customer support recognizing that health is influenced by various factors requiring immediate attention.',
      link: '/medicines',
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Health Treatments',
      description: 'Tailored treatment plans focused on your recovery and wellness.',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Verified Pharmacies',
      description: 'Partner with certified pharmacies ensuring authentic medicines.',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Expert Pharmacists',
      description: 'Highly trained specialists providing personalized care and guidance.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Regular Customer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      text: 'From the moment I started using MediMitra, I felt genuinely cared for. The pharmacists are knowledgeable and the delivery is always on time.',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Senior Citizen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      text: 'Everyone from customer service to delivery is professional. The platform is easy to use and medicines are always authentic.',
    },
    {
      name: 'Anita Desai',
      role: 'Working Professional',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      text: 'The service is incredibly reliable. I can order my medicines anytime and they arrive quickly. Highly recommended!',
    },
    {
      name: 'Vikram Singh',
      role: 'Healthcare Worker',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      text: 'As a healthcare professional, I trust MediMitra for their quality assurance and excellent customer service.',
    },
  ];

  const departmentCategories = [
    'PRESCRIPTION MEDICINES',
    'OVER-THE-COUNTER',
    'VITAMINS & SUPPLEMENTS',
    'PERSONAL CARE',
    'BABY CARE',
    'DIABETES CARE',
    'AYURVEDIC',
    'HOMEOPATHY',
    'FIRST AID',
    'SURGICAL ITEMS',
  ];

  return (
    <div className="font-body bg-white">
      {/* HERO SECTION - Full Mednix Style */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1920&h=1080&fit=crop)',
            opacity: 0.15
          }}
        />
        
        <div className="relative z-10">
          {/* Top Label */}
          <div className="text-center pt-20 pb-8">
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-medical-teal text-sm font-bold tracking-widest mb-2"
            >
              MEDIMITRA
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm tracking-wider"
            >
              SPECIALIZED TREATMENTS
            </motion.p>
          </div>

          {/* Main Hero Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight"
              >
                Your Trusted Partner in<br />
                <span className="text-medical-teal">Health and Wellness</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Our experienced medical team combines the latest technology with personalized 
                attention to provide you with exceptional healthcare tailored to your unique needs.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 justify-center"
              >
                <Link
                  to={user ? "/medicines" : "/login-user"}
                  className="group bg-medical-teal hover:bg-medical-green text-white px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-2"
                >
                  {user ? "Browse Medicines" : "Get Started"}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  to="/medicines"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-2"
                >
                  Browse Medicines
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </Link>
                
                <Link
                  to="/store-locator"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center gap-2"
                >
                  Find Stores
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </Link>
              </motion.div>

              {/* Stats Boxes */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
              >
                {[
                  { number: '24/7', label: 'Service Available' },
                  { number: '500+', label: 'Medicines' },
                  { number: '50+', label: 'Partner Stores' },
                  { number: '10K+', label: 'Happy Customers' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-medical-teal mb-2">{stat.number}</div>
                    <div className="text-white text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* SCROLLING DEPARTMENTS BANNER */}
      <div className="bg-primary-800 py-5 overflow-hidden">
        <div className="flex gap-12 animate-scroll whitespace-nowrap">
          {[...departmentCategories, ...departmentCategories, ...departmentCategories].map((item, index) => (
            <span key={index} className="text-white font-bold text-sm tracking-widest flex items-center gap-3">
              {item}
              <span className="text-medical-teal text-2xl">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left - Image Grid */}
            <div className="grid grid-cols-2 gap-6" data-aos="fade-right">
              <div className="space-y-6">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop" 
                  alt="Medical Professional" 
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=300&fit=crop" 
                  alt="Healthcare" 
                  className="rounded-2xl shadow-2xl w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-6 pt-12">
                <img 
                  src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=300&fit=crop" 
                  alt="Medical Care" 
                  className="rounded-2xl shadow-2xl w-full h-48 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop" 
                  alt="Healthcare Services" 
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div data-aos="fade-left">
              <p className="text-primary-600 font-bold text-sm tracking-widest mb-4">ABOUT MEDIMITRA</p>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                Caring for You Like<br />
                <span className="text-primary-600">Family Health</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We're committed to offering compassionate and comprehensive healthcare tailored 
                to your needs. At MediMitra, your health is our priority every step of the way. 
                Our experienced team provides personalized care and attention.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Verified and certified partner pharmacies',
                  'Quality-tested authentic medicines',
                  '24/7 customer support and delivery',
                  'Expert pharmacist consultation'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-medical-teal/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-medical-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/medicines"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                Discover More
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <p className="text-primary-600 font-bold text-sm tracking-widest mb-4">OUR BENEFITS</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Comprehensive Medical Services for<br />
              <span className="text-primary-600">Your Health</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our expert team combines state-of-the-art technology with personalized care to 
              provide treatments designed around your unique health needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-primary-600 font-bold group-hover:gap-2 transition-all"
                >
                  Explore Service
                  <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES WITH IMAGE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div data-aos="fade-right">
              <p className="text-primary-600 font-bold text-sm tracking-widest mb-4">TRUSTED EXPERTS IN MEDICAL HEALTH AND WELLNESS</p>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-8 leading-tight">
                Reliable Care with<br />
                <span className="text-primary-600">MediMitra Healthcare</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-12">
                Our expert team combines state-of-the-art technology with personalized care to 
                provide treatments designed around your unique health needs.
              </p>

              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">82%</div>
                  <div className="text-sm text-gray-600">Repeat Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Quality Assured</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div data-aos="fade-left" className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop" 
                alt="Healthcare Professional" 
                className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary-600 text-white p-8 rounded-xl shadow-2xl">
                <div className="text-5xl font-bold mb-2">25+</div>
                <div className="text-sm">Years of Medical Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <p className="text-primary-600 font-bold text-sm tracking-widest mb-4">FEEDBACK FROM</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Our Patients
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-12 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <img 
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-medical-teal text-5xl mb-4">"</div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {testimonials[currentTestimonial].text}
                    </p>
                    <div>
                      <p className="font-heading font-bold text-gray-900 text-xl">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-primary-600 font-semibold">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-primary-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PORTAL ACCESS / CTA SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <p className="text-primary-600 font-bold text-sm tracking-widest mb-4">ACCESS PORTALS</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Choose Your Portal
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Select the portal that best suits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '👨‍💼',
                title: 'Admin Portal',
                subtitle: 'Manage Platform',
                description: 'Control medicines, stores, and monitor overall platform activities with comprehensive management tools.',
                link: '/admin',
                color: 'primary',
              },
              {
                icon: '🏪',
                title: 'Store Portal',
                subtitle: 'Manage Inventory',
                description: 'Track inventory, manage customers, and handle orders efficiently with real-time updates and analytics.',
                link: '/store',
                color: 'secondary',
              },
              {
                icon: '👤',
                title: 'Customer Portal',
                subtitle: 'Shop Medicines',
                description: 'Browse, search, and purchase medicines with ease and convenience from verified pharmacies nationwide.',
                link: '/medicines',
                color: 'teal',
              },
            ].map((portal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Link to={portal.link} className="group block h-full">
                  <div className="bg-white border-2 border-gray-100 hover:border-primary-500 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {portal.icon}
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-primary-600 font-bold text-sm mb-4 tracking-wider">
                      {portal.subtitle}
                    </p>
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                      {portal.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-bold group-hover:gap-2 transition-all">
                      Access Portal
                      <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY SERVICES BANNER */}
      <div className="bg-primary-800 py-6 overflow-hidden">
        <div className="flex gap-12 animate-scroll whitespace-nowrap">
          {['24/7 EMERGENCY SERVICES', 'EXPERIENCED PHARMACISTS ON CALL', 'DELIVERY AVAILABLE ANYTIME', 'QUALITY MEDICINES GUARANTEED', '24/7 EMERGENCY SERVICES', 'EXPERIENCED PHARMACISTS ON CALL', 'DELIVERY AVAILABLE ANYTIME', 'QUALITY MEDICINES GUARANTEED', '24/7 EMERGENCY SERVICES', 'EXPERIENCED PHARMACISTS ON CALL'].map((item, index) => (
            <span key={index} className="text-white font-bold text-sm tracking-widest flex items-center gap-3">
              {item}
              <span className="text-medical-teal text-2xl">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <section className="relative py-24 bg-gradient-to-r from-primary-900 to-primary-700 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop)' }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust MediMitra for their healthcare needs. 
              Experience quality, convenience, and care.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              {!user ? (
                <>
                  <Link 
                    to="/register" 
                    className="bg-medical-teal hover:bg-medical-green text-white px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    Create Account Now
                  </Link>
                  <Link 
                    to="/medicines" 
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300"
                  >
                    Browse Medicines
                  </Link>
                </>
              ) : (
                <Link 
                  to="/medicines" 
                  className="bg-medical-teal hover:bg-medical-green text-white px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Browse Medicines
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="text-2xl font-heading font-bold">MediMitra</span>
              </div>
              <p className="text-gray-400 mb-6">
                Dedicated to providing flexible & accessible healthcare services with quality medicines and expert care.
              </p>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm font-bold mb-2">Opening Hours:</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Mon - Fri: 9:00 - 18:00</p>
                  <p>Sat - Sun: 8:00 - 16:00</p>
                  <p className="text-medical-teal font-semibold">Emergency: 24/7</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'Medicines', 'Store Locator', 'About Us', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-medical-teal transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-heading font-bold text-lg mb-6">Our Services</h3>
              <ul className="space-y-3">
                {['Prescription Medicines', 'OTC Products', 'Home Delivery', 'Health Consultation', 'Store Partnership'].map((service, index) => (
                  <li key={index}>
                    <span className="text-gray-400">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading font-bold text-lg mb-6">Contact Us</h3>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-medical-teal mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>India</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-medical-teal mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@medimitra.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-medical-teal mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 1234567890</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 MediMitra. Made with ❤️ for better healthcare.
            </p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                <Link key={index} to="#" className="text-gray-400 hover:text-medical-teal text-sm transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
