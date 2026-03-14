import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Globe,
  AlertCircle,
  Loader2,
  User,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.username || !formData.firstName || !formData.lastName) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await api.register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone || ''
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      // Error toast is already shown by the API client
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
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, #ff00f2 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, #00f2ff 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff00f2, #00f2ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>K</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>KUDZNED</h1>
          </div>
          
          <div style={{ maxWidth: '480px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}
            >
              Join the <span style={{ color: '#ff00f2' }}>Elite</span> Digital Marketplace.
            </motion.h2>
            <p style={{ fontSize: '18px', color: '#a0a0b8', marginBottom: '48px' }}>Create your account and access exclusive digital goods with enterprise-grade security.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: ShieldCheck, text: 'Military-grade encryption & security' },
                { icon: Zap, text: 'Instant access to premium products' },
                { icon: Globe, text: 'Join 10k+ verified members worldwide' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#ff00f2' }}>
                    <item.icon size={20} />
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '24px', color: '#a0a0b8', fontSize: '14px' }}>
          <span>© 2024 KUDZNED Shop</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-wrapper">
         <div style={{ width: '100%', maxWidth: '420px' }}>
            {/* Mobile Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '32px' }} className="lg-hidden">
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff00f2, #00f2ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>K</span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px' }}>KUDZNED</h1>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '12px' }}>Create Account</h3>
              <p style={{ color: '#a0a0b8' }}>Join the elite marketplace today</p>
            </div>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: 'rgba(255, 75, 75, 0.1)',
                    border: '1px solid rgba(255, 75, 75, 0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ff4b4b'
                  }}
                >
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{error}</span>
                </motion.div>
              )}

              {/* Name Fields Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>First Name</label>
                  <div style={{ 
                    backgroundColor: '#0d0d12', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', 
                    padding: '4px 16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px'
                  }} className="focus-within-border-cyan">
                    <User size={18} className="text-[#a0a0b8]" />
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John" 
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Last Name</label>
                  <div style={{ 
                    backgroundColor: '#0d0d12', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', 
                    padding: '4px 16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px'
                  }} className="focus-within-border-cyan">
                    <User size={18} className="text-[#a0a0b8]" />
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe" 
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Username</label>
                <div style={{ 
                  backgroundColor: '#0d0d12', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '4px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px'
                }} className="focus-within-border-cyan">
                  <UserPlus size={18} className="text-[#a0a0b8]" />
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="johndoe123" 
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Email Address</label>
                <div style={{ 
                  backgroundColor: '#0d0d12', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '4px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px'
                }} className="focus-within-border-cyan">
                  <Mail size={18} className="text-[#a0a0b8]" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com" 
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Password</label>
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
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••" 
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#a0a0b8' }}>Confirm Password</label>
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••" 
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '16px' }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                  backgroundColor: isLoading ? '#666' : '#ff00f2', 
                  color: isLoading ? '#ccc' : '#fff', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  fontWeight: '800', 
                  fontSize: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  marginTop: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%',
                  transition: 'all 0.2s',
                  border: 'none'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <p style={{ color: '#a0a0b8', fontSize: '14px' }}>
                Already have an account? 
                <Link to="/login" style={{ color: '#ffffff', fontWeight: '700', marginLeft: '6px', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </div>
            
            <div style={{ marginTop: '48px', padding: '20px', borderRadius: '20px', backgroundColor: 'rgba(255,0,242,0.03)', border: '1px solid rgba(255,0,242,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
               <span style={{ fontSize: '13px', color: '#a0a0b8' }}>Secure registration. Your data is encrypted.</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Signup;