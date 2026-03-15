import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ChevronRight, 
  CreditCard, 
  Users,
  Twitter,
  Github,
  MessageSquare,
  Layout,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      delay, 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }}
    whileHover={{ 
      y: -8,
      transition: { duration: 0.3 }
    }}
    style={{ 
      backgroundColor: '#0d0d12', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '24px', 
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}
    className="hover:border-[rgba(0,242,255,0.3)] transition-colors group"
  >
    <motion.div 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,242,255,0.5), transparent)',
        opacity: 0
      }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    <motion.div 
      style={{ backgroundColor: 'rgba(0,242,255,0.05)', padding: '12px', borderRadius: '12px', color: '#00f2ff', width: 'fit-content' }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Icon size={24} />
    </motion.div>
    <h4 style={{ fontSize: '20px', fontWeight: '800' }}>{title}</h4>
    <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: '1.6' }}>{description}</p>
  </motion.div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isLoading } = useAuth();
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '80px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        backgroundColor: 'rgba(5, 5, 5, 0.8)', 
        backdropFilter: 'blur(10px)', 
        zIndex: 1000, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <div style={{ width: '100%', maxWidth: '1280px', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>S</span>
          </motion.div>
          <span style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '1px' }}>SONNET</span>
        </motion.div>
        
        <div style={{ display: 'none' }} className="lg-flex gap-8 items-center">
           {['Market', 'Logs', 'Proof'].map(link => (
             <a key={link} href="#" style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }} className="hover:text-[#00f2ff]">{link}</a>
           ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isLoading ? (
            <div style={{ width: '100px' }} /> // Placeholder to prevent jump
          ) : !isAuthenticated ? (
            <>
              <motion.button 
                onClick={() => navigate('/login')}
                style={{ fontSize: '14px', fontWeight: '700', color: 'white', padding: '10px 20px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button 
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#00f2ff', color: '#000', padding: '10px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                onClick={() => navigate('/dashboard')}
                style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', color: '#00f2ff', padding: '10px 24px', borderRadius: '12px', border: '1px solid rgba(0, 242, 255, 0.2)', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 242, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard <Layout size={16} />
              </motion.button>
              <motion.button 
                onClick={logout}
                style={{ color: '#ff4b4b', padding: '10px 20px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout <LogOut size={16} />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <footer style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px 40px 24px' }}>
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Ready to start CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          backgroundColor: '#0d0d12', 
          border: '1px solid rgba(0, 242, 255, 0.1)', 
          borderRadius: '32px', 
          padding: '60px 40px', 
          marginBottom: '80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0, 242, 255, 0.5), transparent)' }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 0%'],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', marginBottom: '20px' }}
        >
          {isAuthenticated ? 'Ready to Access Your Assets?' : 'Ready to Scale Your Wealth?'}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ color: '#a0a0b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px auto' }}
        >
          {isAuthenticated 
            ? 'Continue trading and managing your digital portfolio on our advanced dashboard.'
            : 'Join 10,000+ investors already benefiting from the SONNET marketplace.'}
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 60px rgba(0, 242, 255, 0.4)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
          style={{ backgroundColor: '#00f2ff', color: '#000', padding: '16px 40px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto' }}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </motion.button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
        <div style={{ gridColumn: 'span 2' }}>
           <div 
             onClick={() => navigate('/')}
             style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}
           >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>S</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>SONNET</h1>
          </div>
          <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: '1.6', maxWidth: '300px' }}>
            The world's most trusted marketplace for premium digital assets, bank logs, and secure fulfillment. Secure, fast, and anonymous.
          </p>
        </div>

        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px', fontSize: '14px', textTransform: 'uppercase', color: '#6b6b7d', letterSpacing: '1px' }}>Product</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Marketplace', 'Bank Logs', 'Fullz/SSN', 'Methods'].map(item => (
              <li key={item}><a href="#" style={{ color: '#a0a0b8', fontSize: '15px' }} className="hover:text-[#00f2ff]">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px', fontSize: '14px', textTransform: 'uppercase', color: '#6b6b7d', letterSpacing: '1px' }}>Company</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['About Us', 'Careers', 'Blog', 'Contact', 'Vouches'].map(item => (
              <li key={item}><a href="#" style={{ color: '#a0a0b8', fontSize: '15px' }} className="hover:text-[#00f2ff]">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px', fontSize: '14px', textTransform: 'uppercase', color: '#6b6b7d', letterSpacing: '1px' }}>Resources</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Documentation', 'API Access', 'Support', 'Telegram Link', 'Community'].map(item => (
              <li key={item}><a href="#" style={{ color: '#a0a0b8', fontSize: '15px' }} className="hover:text-[#00f2ff]">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
        <p style={{ color: '#6b6b7d', fontSize: '14px' }}>© 2024 SONNET Technologies Inc. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Twitter size={20} className="text-[#a0a0b8] hover:text-[#1d9bf0] cursor-pointer" />
          <Github size={20} className="text-[#a0a0b8] hover:text-white cursor-pointer" />
          <MessageSquare size={20} className="text-[#a0a0b8] hover:text-[#00f2ff] cursor-pointer" />
        </div>
      </div>

      <div style={{ 
        width: '100%', 
        textAlign: 'center', 
        paddingTop: '40px',
        userSelect: 'none',
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(60px, 13vw, 400px)', 
          fontWeight: '950', 
          lineHeight: 0.8, 
          margin: '0 auto',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          width: 'fit-content'
        }}>
          SONNET
        </h1>
      </div>
    </div>
    </footer>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div style={{ backgroundColor: '#050505', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '180px 24px 100px 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated Background Blurs */}
        <motion.div 
          style={{ position: 'absolute', top: '10%', left: '50%', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(0, 242, 255, 0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}
          animate={{ 
            x: ['-50%', '-45%', '-50%'],
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{ position: 'absolute', top: '30%', right: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 0, 242, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'rgba(0, 242, 255, 0.05)', 
              border: '1px solid rgba(0, 242, 255, 0.1)', 
              padding: '8px 16px', 
              borderRadius: '100px', 
              color: '#00f2ff', 
              fontSize: '13px', 
              fontWeight: '800', 
              marginBottom: '32px' 
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={14} fill="currentColor" />
            </motion.div>
            V3.0 MARKETPLACE IS NOW LIVE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              fontSize: 'clamp(48px, 8vw, 92px)', 
              fontWeight: '900', 
              letterSpacing: '-0.04em', 
              lineHeight: 0.95, 
              marginBottom: '32px',
              background: 'linear-gradient(to bottom, #fff 40%, #a0a0b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Premium Assets for the{' '}
            <motion.span 
              style={{ color: '#00f2ff', display: 'inline-block' }}
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(0, 242, 255, 0.3)',
                  '0 0 40px rgba(0, 242, 255, 0.5)',
                  '0 0 20px rgba(0, 242, 255, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Elite.
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ 
              fontSize: 'clamp(18px, 3vw, 22px)', 
              color: '#a0a0b8', 
              lineHeight: 1.5, 
              maxWidth: '700px', 
              margin: '0 auto 48px auto' 
            }}
          >
            Experience the next generation of digital trading. Access high-balance logs, secure wires, and global assets delivered instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', minHeight: '60px' }}
          >
            {isLoading ? (
              <div style={{ height: '60px', width: '200px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '18px' }} className="loading-skeleton" />
            ) : (
              <>
                <motion.button 
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                  style={{ padding: '18px 48px', borderRadius: '18px', backgroundColor: '#00f2ff', color: '#000', fontWeight: '900', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)' }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 60px rgba(0, 242, 255, 0.4)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Enter Marketplace'}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </motion.button>
                <motion.button 
                  style={{ padding: '18px 48px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: '800', fontSize: '18px', border: '1px solid rgba(255,255,255,0.1)' }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Vouches
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section style={{ padding: '0 24px 100px 24px' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
            >
               {[
                 { label: 'Total Volume', value: '$84M+', icon: CreditCard },
                 { label: 'Active Users', value: '12.4K', icon: Users },
                 { label: 'Asset Delivery', value: 'Instantly', icon: Zap },
                 { label: 'Support Speed', value: '<5 Min', icon: MessageSquare }
               ].map((stat, i) => (
                 <motion.div 
                   key={i} 
                   style={{ backgroundColor: '#0d0d12', padding: '40px', textAlign: 'center' }}
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1, duration: 0.5 }}
                   whileHover={{ 
                     backgroundColor: '#16161e',
                     transition: { duration: 0.2 }
                   }}
                 >
                    <p style={{ color: '#6b6b7d', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{stat.label}</p>
                    <motion.h3 
                      style={{ fontSize: '42px', fontWeight: '900', color: i === 2 ? '#00f2ff' : 'white' }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.h3>
                 </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'left', marginBottom: '64px' }}
        >
           <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '16px' }}>
             Built for Privacy. <br/>
             Optimized for{' '}
             <motion.span 
               style={{ color: '#ff00f2', display: 'inline-block' }}
               animate={{ 
                 textShadow: [
                   '0 0 20px rgba(255, 0, 242, 0.3)',
                   '0 0 40px rgba(255, 0, 242, 0.5)',
                   '0 0 20px rgba(255, 0, 242, 0.3)'
                 ]
               }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
               Profit.
             </motion.span>
           </h2>
           <p style={{ color: '#a0a0b8', fontSize: '18px', maxWidth: '600px' }}>Our infrastructure ensures every transaction is anonymous while maximizing your trading success.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <FeatureCard 
            icon={ShieldCheck} 
            title="Military-Grade Security" 
            description="All user data and purchase histories are encrypted using RSA-4096 and hidden from prying eyes."
            delay={0.1}
          />
          <FeatureCard 
            icon={Globe} 
            title="Global Market Reach" 
            description="Access banking logs and digital assets from over 85+ countries including USA, UK, Canada, and EU."
            delay={0.2}
          />
          <FeatureCard 
            icon={Layout} 
            title="Premium Dashboard" 
            description="Monitor your investments, track active orders, and manage your wallet with a world-class interface."
            delay={0.3}
          />
        </div>
      </section>

      {/* Preview Section */}
      <section style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
         <motion.div 
           initial={{ opacity: 0, y: 60 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
           style={{ 
             backgroundColor: '#0d0d12', 
             borderRadius: '40px', 
             border: '1px solid rgba(255,255,255,0.05)', 
             padding: '80px 40px',
             display: 'grid',
             gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
             gap: '64px',
             alignItems: 'center',
             position: 'relative',
             overflow: 'hidden'
           }}
         >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '24px' }}>The SONNET Experience</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { title: 'Verified Purchases', desc: 'Each asset is checked for quality before listing.' },
                  { title: 'Crypto Friendly', desc: 'Deposit funds using BTC, ETH, LTC or SOL instantly.' },
                  { title: 'Zero Fees', desc: 'We don\'t charge any maintenance fees for active accounts.' }
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    style={{ display: 'flex', gap: '16px' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  >
                    <motion.div 
                      style={{ marginTop: '4px', width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                       <ChevronRight size={14} color="#00f2ff" />
                    </motion.div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '18px' }}>{item.title}</p>
                      <p style={{ color: '#a0a0b8', fontSize: '15px' }}>{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              style={{ position: 'relative' }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div 
                style={{ 
                  backgroundColor: '#16161e', 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  aspectRatio: '16/10', 
                  padding: '24px',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 50px 120px rgba(0,0,0,0.9)',
                  transition: { duration: 0.3 }
                }}
              >
                 {/* Mock UI with animations */}
                 <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <motion.div 
                      style={{ width: '40px', height: '8px', borderRadius: '10px', backgroundColor: '#00f2ff' }}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      style={{ width: '20px', height: '8px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                    <motion.div 
                      style={{ width: '20px', height: '8px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                 </div>
                 <motion.div 
                   style={{ height: '20px', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }}
                   animate={{ width: ['60%', '70%', '60%'] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 />
                 <motion.div 
                   style={{ height: '32px', width: '40%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '32px' }}
                   animate={{ opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                 />
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <motion.div 
                      style={{ height: '100px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div 
                      style={{ height: '100px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                 </div>
              </motion.div>
              <motion.div 
                style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 0, 242, 0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: -1 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
         </motion.div>
      </section>

      <Footer />

    </div>
  );
};

export default Landing;
