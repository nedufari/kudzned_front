import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div style={{
    backgroundColor: '#0d0d12',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${color}15, transparent)`, pointerEvents: 'none' }} />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: `${color}10`, color: color }}>
        <Icon size={24} />
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
          <TrendingUp size={14} />
          {trend}%
        </div>
      )}
    </div>
    
    <p style={{ color: '#a0a0b8', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{label}</p>
    <h3 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em' }}>{value}</h3>
  </div>
);

const SectionHeader = ({ title, action }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h3>
    {action && (
      <button style={{ color: '#00f2ff', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', background: 'none' }}>
        {action}
        <ArrowUpRight size={16} />
      </button>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div variants={item}>
          <StatCard label="Total Spent" value="$2,450.00" icon={CreditCard} color="#00f2ff" trend="12" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Orders Placed" value="18" icon={ShoppingBag} color="#ff00f2" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Live Vouchers" value="842" icon={ShieldCheck} color="#10b981" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Active Items" value="124" icon={Zap} color="#f59e0b" />
        </motion.div>
      </div>

      <div className="main-grid">
        {/* Recent Activity */}
        <motion.div variants={item} style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
          <SectionHeader title="Recent Transactions" action="View All" />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1a1a24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2ff' }}>
                  <ShoppingBag size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Wells Fargo Business Log</h4>
                  <p style={{ fontSize: '12px', color: '#a0a0b8' }}>Order #WS-9238 • 2 hours ago</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: '700' }}>$150.00</p>
                  <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Completed</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Announcements / Quick Actions */}
        <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'linear-gradient(135deg, #00f2ff, #0099ff)', borderRadius: '24px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }} className="bg-gradient-to-br from-[#00f2ff] to-[#0099ff]">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Join the VIP Club</h3>
              <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>Get exclusive access to high-balance logs before they hit the general shop.</p>
              <button style={{ backgroundColor: 'white', color: '#00f2ff', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px' }}>
                Learn More
              </button>
            </div>
            <TrendingUp size={120} style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.2, rotate: '-15deg' }} />
          </div>

          <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
            <SectionHeader title="Support" />
            <p style={{ fontSize: '14px', color: '#a0a0b8', marginBottom: '20px' }}>Need help with an order? Our team is available 24/7 via Telegram.</p>
            <button style={{ width: '100%', backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ExternalLink size={18} />
              Open Tickets
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
