import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Error toast is already shown by the context/api client
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Visuals (hidden on mobile/tablet) */}
      <div 
        style={{ 
          flex: 1, 
          position: 'relative', 
          flexDirection: 'column', 
          padding: '64px', 
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #050505 0%, #0d0d12 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }} 
        className="hidden lg-flex"
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, #00f2ff 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, #ff00f2 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>S</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>SONNET</h1>
          </div>
          
          <div style={{ maxWidth: '480px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}
            >
              The World's <span style={{ color: '#00f2ff' }}>Premium</span> Digital Goods Store.
            </motion.h2>
            <p style={{ fontSize: '18px', color: '#a0a0b8', marginBottom: '48px' }}>Access exclusive premium accounts and digital assets with advanced security.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: ShieldCheck, text: 'Instantly delivered after confirmation' },
                { icon: Zap, text: '24/7 Priority support via Telegram' },
                { icon: Globe, text: 'Global marketplace with 10k+ users' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#00f2ff' }}>
                    <item.icon size={20} />
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '24px', color: '#a0a0b8', fontSize: '14px' }}>
          <span>© 2024 SONNET Shop</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-wrapper">
         <div style={{ width: '100%', maxWidth: '420px' }}>
            {/* Mobile Logo Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '32px' }} className="lg-hidden">
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>S</span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px' }}>SONNET</h1>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '12px' }}>Welcome Back</h3>
              <p style={{ color: '#a0a0b8' }}>Securely access your account below</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Email Address</label>
                <div style={{ 
                  backgroundColor: '#0d0d12', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '4px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  transition: 'border-color 0.2s'
                }} className="focus-within-border-cyan">
                  <Mail size={18} className="text-[#a0a0b8]" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Password</label>
                  <a href="#" style={{ fontSize: '14px', color: '#ff00f2', fontWeight: '600' }}>Forgot?</a>
                </div>
                <div style={{ 
                  backgroundColor: '#0d0d12', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '4px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px'
                }} className="focus-within-border-cyan">
                  <Lock size={18} className="text-[#a0a0b8]" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#a0a0b8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0b8'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                  backgroundColor: '#00f2ff', 
                  color: '#000', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  fontWeight: '800', 
                  fontSize: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  marginTop: '12px',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%'
                }}
              >
                {isLoading ? 'Decrypting Access...' : 'Login to Account'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <p style={{ color: '#a0a0b8', fontSize: '14px' }}>
                No account? 
                <Link to="/signup" style={{ color: '#ffffff', fontWeight: '700', marginLeft: '6px', textDecoration: 'none' }}>
                  Sign up
                </Link>
              </p>
            </div>
            
            <div style={{ marginTop: '48px', padding: '20px', borderRadius: '20px', backgroundColor: 'rgba(0,242,255,0.03)', border: '1px solid rgba(0,242,255,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
               <span style={{ fontSize: '13px', color: '#a0a0b8' }}>All systems operational. Marketplace online.</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
