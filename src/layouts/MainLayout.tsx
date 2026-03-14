import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  History, 
  User, 
  MessageSquare, 
  Video, 
  LogOut,
  PlusCircle,
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Bell,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const SidebarLink = ({ to, icon: Icon, label, badge, onClick }: { to: string, icon: any, label: string, badge?: string, onClick?: () => void }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    style={({ isActive }) => ({
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: isActive ? 'rgba(0, 242, 255, 0.08)' : 'transparent',
      color: isActive ? '#00f2ff' : '#a0a0b8',
      borderLeft: isActive ? '3px solid #00f2ff' : '3px solid transparent',
      margin: '2px 0'
    })}
    className="group"
  >
    <Icon size={20} className="group-hover:scale-110 transition-transform shrink-0" />
    <span className="font-semibold flex-1 text-[15px] tracking-tight">{label}</span>
    {badge ? (
      badge === 'NEW' ? (
        <motion.span 
          animate={{
            boxShadow: ['0 0 0px #ff00f2', '0 0 10px #ff00f2', '0 0 0px #ff00f2'],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-[#ff00f2] text-white text-[10px] px-2 py-0.5 rounded-full font-black tracking-wider shadow-lg"
        >
          {badge}
        </motion.span>
      ) : (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -10, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.6, 1]
          }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0px rgba(0, 242, 255, 0)',
                '0 0 15px rgba(0, 242, 255, 0.6)',
                '0 0 0px rgba(0, 242, 255, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 242, 255, 0.3) 0%, transparent 70%)',
              filter: 'blur(4px)'
            }}
          />
          <motion.span 
            animate={{
              backgroundColor: ['#00f2ff', '#00d4ff', '#00f2ff']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'relative',
              backgroundColor: '#00f2ff',
              color: '#000',
              fontSize: '11px',
              fontWeight: '900',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(0, 242, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 242, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.3)'
            }}
          >
            {badge}
          </motion.span>
        </motion.div>
      )
    ) : (
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
    )}
  </NavLink>
);

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0.00');

  // Load cart count and wallet balance on component mount
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const cart = await api.getCart();
        const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemCount(totalItems);
      } catch (error) {
        console.error('Failed to load cart count (MainLayout):', error);
        setCartItemCount(0);
        // Don't show toast errors in MainLayout to avoid duplicate errors
      }
    };

    const loadWalletBalance = async () => {
      try {
        const wallet = await api.getWallet();
        const balance = (parseFloat(wallet.balance) / 100).toFixed(2); // Convert from satoshis to dollars
        setWalletBalance(balance);
      } catch (error) {
        console.error('Failed to load wallet balance (MainLayout):', error);
        setWalletBalance('0.00');
        // Don't show toast errors in MainLayout to avoid duplicate errors
      }
    };

    // Load data silently without showing errors
    const loadData = async () => {
      try {
        await Promise.allSettled([loadCartCount(), loadWalletBalance()]);
      } catch (error) {
        console.error('Failed to load MainLayout data:', error);
        // Silently handle errors to prevent duplicate toasts
      }
    };

    loadData();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCartCount().catch(error => {
        console.error('Failed to update cart count:', error);
      });
    };

    // Listen for wallet updates
    const handleWalletUpdate = () => {
      loadWalletBalance().catch(error => {
        console.error('Failed to update wallet balance:', error);
      });
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('walletUpdated', handleWalletUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('walletUpdated', handleWalletUpdate);
    };
  }, []);

  // Refresh cart count when navigating to/from cart page
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/cart') {
      // Refresh cart count when visiting cart page
      const loadCartCount = async () => {
        try {
          const cart = await api.getCart();
          const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        } catch (error) {
          console.error('Failed to load cart count (MainLayout):', error);
          setCartItemCount(0);
          // Don't show toast errors in MainLayout
        }
      };
      loadCartCount();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    console.log('Logging out...');
    // Clear token and redirect
    api.logout();
    console.log('Token cleared, redirecting to login');
    navigate('/login');
  };

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2">
          <Menu size={24} color="#00f2ff" />
        </button>
        <div 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: '900', fontSize: '14px' }}>K</span>
          </div>
          <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '16px' }}>KUDZNED</span>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2 -mr-2 relative"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={20} color="#a0a0b8" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ff00f2',
              boxShadow: '0 0 10px rgba(255, 0, 242, 0.6)'
            }}
          />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <aside className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: '16px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #00f2ff, #ff00f2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)' }}>
              <span style={{ color: 'white', fontWeight: '900', fontSize: '20px' }}>K</span>
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1.5px', color: 'white', margin: 0 }}>
              KUDZNED
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} style={{ display: 'none' }} className="lg:hidden p-2">
             <X size={20} color="#6b6b7d" />
          </button>
          {/* Show X only on mobile sidebar */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media (max-width: 1024px) {
              .close-btn { display: flex !important; }
            }
          `}} />
          <button onClick={() => setIsSidebarOpen(false)} className="close-btn p-2" style={{ display: 'none' }}>
            <X size={20} color="#6b6b7d" />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 12px 24px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/shop" icon={ShoppingBag} label="Shop" badge="NEW" />
          <SidebarLink to="/topup" icon={PlusCircle} label="Topups" />
          <SidebarLink to="/transfers" icon={CreditCard} label="Transfers" />
          <SidebarLink to="/cart" icon={ShoppingCart} label="My Cart" badge={cartItemCount > 0 ? cartItemCount.toString() : undefined} />
          
          <div style={{ padding: '32px 16px 12px 16px', fontSize: '11px', fontWeight: '800', color: '#4b4b5e', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Support & Info</div>
          
          <SidebarLink to="/cashout-clips" icon={Video} label="Cashout Clips" />
          <SidebarLink to="/vouches" icon={MessageSquare} label="Vouches" />
          <SidebarLink to="/orders" icon={History} label="My Orders" />
          
          <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <SidebarLink to="/notifications" icon={Bell} label="Notifications" badge="3" />
            <SidebarLink to="/profile" icon={User} label="My Profile" />
            <div 
              onClick={handleLogout}
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px', color: '#ff4b4b', cursor: 'pointer', marginTop: '4px', transition: 'all 0.2s', borderRadius: '12px' }} 
              className="hover:bg-[rgba(255,75,75,0.05)] group"
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-semibold text-[15px]">Logout</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content-wrapper">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', textAlign: 'left', color: 'white' }}>Welcome Back, <span style={{ color: '#00f2ff' }}>Nedu</span></h2>
            <p style={{ color: '#a0a0b8', fontSize: '16px', textAlign: 'left' }}>Market is booming. Check out the latest logs.</p>
          </div>
          
          <div style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="lg:flex">
            <div style={{ backgroundColor: '#0d0d12', padding: '10px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(0,242,255,0.1)', padding: '8px', borderRadius: '10px' }}>
                <Wallet size={18} className="text-[#00f2ff]" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '10px', color: '#6b6b7d', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.8px' }}>Balance</p>
                <p style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>${walletBalance}</p>
              </div>
            </div>
            
            <motion.div
              onClick={() => navigate('/notifications')}
              style={{ 
                position: 'relative', 
                width: '48px', 
                height: '48px', 
                borderRadius: '16px', 
                backgroundColor: '#0d0d12', 
                border: '1px solid rgba(255,255,255,0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
              className="hover:border-[#00f2ff]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell size={22} color="#a0a0b8" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 0px rgba(255, 0, 242, 0)',
                    '0 0 15px rgba(255, 0, 242, 0.8)',
                    '0 0 0px rgba(255, 0, 242, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ position: 'absolute', top: -6, right: -6 }}
              >
                <motion.div
                  animate={{
                    backgroundColor: ['#ff00f2', '#ff33f5', '#ff00f2']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ 
                    backgroundColor: '#ff00f2', 
                    color: 'white', 
                    fontSize: '11px', 
                    fontWeight: '900', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: '3px solid #050505',
                    boxShadow: '0 0 15px rgba(255, 0, 242, 0.6)'
                  }}
                >
                  3
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              onClick={() => navigate('/cart')}
              style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              className="hover:border-[#00f2ff]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={22} color="#a0a0b8" />
              {cartItemCount > 0 && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -15, 15, -15, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 1]
                  }}
                  style={{ position: 'absolute', top: -6, right: -6 }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(255, 0, 242, 0)',
                        '0 0 20px rgba(255, 0, 242, 0.8)',
                        '0 0 0px rgba(255, 0, 242, 0)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255, 0, 242, 0.4) 0%, transparent 70%)',
                      filter: 'blur(6px)'
                    }}
                  />
                  <motion.div 
                    animate={{
                      backgroundColor: ['#ff00f2', '#ff33f5', '#ff00f2']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ 
                      position: 'relative',
                      backgroundColor: '#ff00f2', 
                      color: 'white', 
                      fontSize: '11px', 
                      fontWeight: '900', 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: '3px solid #050505',
                      boxShadow: '0 0 15px rgba(255, 0, 242, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {cartItemCount}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <div style={{ width: '48px', height: '48px', borderRadius: '16px', border: '2px solid rgba(0,242,255,0.3)', padding: '2px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:border-[#00f2ff]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nedu" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
            </div>
          </div>
        </header>

        <section style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
