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
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    style={{ 
      backgroundColor: '#0d0d12', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '24px', 
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}
    className="hover:border-[rgba(0,242,255,0.3)] transition-colors group"
  >
    <div style={{ backgroundColor: 'rgba(0,242,255,0.05)', padding: '12px', borderRadius: '12px', color: '#00f2ff', width: 'fit-content' }}>
      <Icon size={24} />
    </div>
    <h4 style={{ fontSize: '20px', fontWeight: '800' }}>{title}</h4>
    <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: '1.6' }}>{description}</p>
  </motion.div>
);

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav style={{ 
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
    }}>
      <div style={{ width: '100%', maxWidth: '1280px', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>K</span>
          </div>
          <span style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '1px' }}>KUDZNED</span>
        </div>
        
        <div style={{ display: 'none' }} className="lg-flex gap-8 items-center">
           {['Market', 'Transfers', 'Logs', 'Proof'].map(link => (
             <a key={link} href="#" style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }} className="hover:text-[#00f2ff]">{link}</a>
           ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ fontSize: '14px', fontWeight: '700', color: 'white', padding: '10px 20px' }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#00f2ff', color: '#000', padding: '10px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px 40px 24px' }}>
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Ready to start CTA */}
      <div style={{ 
        backgroundColor: '#0d0d12', 
        border: '1px solid rgba(0, 242, 255, 0.1)', 
        borderRadius: '32px', 
        padding: '60px 40px', 
        marginBottom: '80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0, 242, 255, 0.5), transparent)' }} />
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', marginBottom: '20px' }}>Ready to Scale Your Wealth?</h2>
        <p style={{ color: '#a0a0b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px auto' }}>Join 10,000+ investors already benefiting from the KUDZNED marketplace.</p>
        <button style={{ backgroundColor: '#00f2ff', color: '#000', padding: '16px 40px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto' }}>
          Create Free Account <ArrowRight size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
        <div style={{ gridColumn: 'span 2' }}>
           <div 
             onClick={() => navigate('/')}
             style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}
           >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>K</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>KUDZNED</h1>
          </div>
          <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: '1.6', maxWidth: '300px' }}>
            The world's most trusted marketplace for premium digital assets, bank logs, and global transfers. Secure, fast, and anonymous.
          </p>
        </div>

        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px', fontSize: '14px', textTransform: 'uppercase', color: '#6b6b7d', letterSpacing: '1px' }}>Product</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Marketplace', 'Bank Logs', 'Transfers', 'Fullz/SSN', 'Methods'].map(item => (
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
        <p style={{ color: '#6b6b7d', fontSize: '14px' }}>© 2024 KUDZNED Technologies Inc. All rights reserved.</p>
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
          KUDZNED
        </h1>
      </div>
    </div>
    </footer>
  );
};

const Landing = () => {
  const navigate = useNavigate();

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
        {/* Background Blur */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(0, 242, 255, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}
        >
          <div style={{ 
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
          }}>
            <Zap size={14} fill="currentColor" />
            V3.0 MARKETPLACE IS NOW LIVE
          </div>

          <h1 style={{ 
            fontSize: 'clamp(48px, 8vw, 92px)', 
             fontWeight: '900', 
             letterSpacing: '-0.04em', 
             lineHeight: 0.95, 
             marginBottom: '32px',
             background: 'linear-gradient(to bottom, #fff 40%, #a0a0b8 100%)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent'
          }}>
            Premium Assets for the <span style={{ color: '#00f2ff' }}>Elite.</span>
          </h1>

          <p style={{ 
            fontSize: 'clamp(18px, 3vw, 22px)', 
            color: '#a0a0b8', 
            lineHeight: 1.5, 
            maxWidth: '700px', 
            margin: '0 auto 48px auto' 
          }}>
            Experience the next generation of digital trading. Access high-balance logs, secure wires, and global assets delivered instantly.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ padding: '18px 48px', borderRadius: '18px', backgroundColor: '#00f2ff', color: '#000', fontWeight: '900', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)' }}
            >
              Enter Marketplace <ArrowRight size={20} />
            </button>
            <button style={{ padding: '18px 48px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: '800', fontSize: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
              View Vouches
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section style={{ padding: '0 24px 100px 24px' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
               {[
                 { label: 'Total Volume', value: '$84M+', icon: CreditCard },
                 { label: 'Active Users', value: '12.4K', icon: Users },
                 { label: 'Asset Delivery', value: 'Instantly', icon: Zap },
                 { label: 'Support Speed', value: '<5 Min', icon: MessageSquare }
               ].map((stat, i) => (
                 <div key={i} style={{ backgroundColor: '#0d0d12', padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#6b6b7d', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{stat.label}</p>
                    <h3 style={{ fontSize: '42px', fontWeight: '900', color: i === 2 ? '#00f2ff' : 'white' }}>{stat.value}</h3>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'left', marginBottom: '64px' }}>
           <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '16px' }}>Built for Privacy. <br/>Optimized for <span style={{ color: '#ff00f2' }}>Profit.</span></h2>
           <p style={{ color: '#a0a0b8', fontSize: '18px', maxWidth: '600px' }}>Our infrastructure ensures every transaction is anonymous while maximizing your trading success.</p>
        </div>

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
            description="Monitor your investments, track active transfers, and manage your wallet with an world-class interface."
            delay={0.3}
          />
        </div>
      </section>

      {/* Preview Section */}
      <section style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
         <div style={{ 
           backgroundColor: '#0d0d12', 
           borderRadius: '40px', 
           border: '1px solid rgba(255,255,255,0.05)', 
           padding: '80px 40px',
           display: 'grid',
           gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
           gap: '64px',
           alignItems: 'center'
         }}>
            <div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '24px' }}>The KUDZNED Experience</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { title: 'Verified Purchases', desc: 'Each asset is checked for quality before listing.' },
                  { title: 'Crypto Friendly', desc: 'Deposit funds using BTC, ETH, LTC or SOL instantly.' },
                  { title: 'Zero Fees', desc: 'We don\'t charge any maintenance fees for active accounts.' }
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ marginTop: '4px', width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <ChevronRight size={14} color="#00f2ff" />
                    </div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '18px' }}>{item.title}</p>
                      <p style={{ color: '#a0a0b8', fontSize: '15px' }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                backgroundColor: '#16161e', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                aspectRatio: '16/10', 
                padding: '24px',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
              }}>
                 {/* Mock UI */}
                 <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '8px', borderRadius: '10px', backgroundColor: '#00f2ff' }} />
                    <div style={{ width: '20px', height: '8px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ width: '20px', height: '8px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                 </div>
                 <div style={{ height: '20px', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }} />
                 <div style={{ height: '32px', width: '40%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '32px' }} />
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ height: '100px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
                    <div style={{ height: '100px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
                 </div>
              </div>
              <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 0, 242, 0.1) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: -1 }} />
            </div>
         </div>
      </section>

      <Footer />

    </div>
  );
};

export default Landing;
