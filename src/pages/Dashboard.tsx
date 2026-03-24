import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  ArrowUpRight, 
  ExternalLink,
  CreditCard,
  Loader2,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpLeft,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { toast } from '../utils/toast';

interface Wallet {
  id: string;
  user_id: string;
  balance: string;
  available_balance: string;
  total_deposited: string;
  total_withdrawn: string;
  created_at: string;
  updated_at: string;
  btc_addresses: string[];
}

interface Transaction {
  id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'refund';
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference?: string;
  created_at: string;
  updated_at: string;
}

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

const SectionHeader = ({ title, action, onActionClick }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h3>
    {action && (
      <button 
        onClick={onActionClick}
        style={{ 
          color: '#00f2ff', 
          fontSize: '14px', 
          fontWeight: '600', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        className="hover:text-[#00d4ff]"
      >
        {action}
        <ArrowUpRight size={16} />
      </button>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wallet and transaction data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data...');
        
        // Load wallet first
        const walletData = await api.getWallet();
        console.log('Wallet loaded:', walletData);
        setWallet(walletData);
        
        // Load transactions separately to avoid blocking wallet display
        try {
          const transactionsData = await api.getTransactions({ page: 1, limit: 5 });
          console.log('Transactions loaded:', transactionsData);
          setTransactions(transactionsData || []);
        } catch (transactionError) {
          console.error('Failed to load transactions (non-blocking):', transactionError);
          // Don't show error toast for transactions, just set empty array
          setTransactions([]);
        }
        
      } catch (error) {
        console.error('Failed to load wallet data:', error);
        toast.error('Failed to load wallet data');
        
        // Set empty fallback data
        setWallet({
          id: 'fallback',
          user_id: 'unknown',
          balance: '0',
          available_balance: '0',
          total_deposited: '0',
          total_withdrawn: '0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          btc_addresses: []
        });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      // Load wallet first
      const walletData = await api.getWallet();
      setWallet(walletData);
      
      // Load transactions separately
      try {
        const transactionsData = await api.getTransactions({ page: 1, limit: 5 });
        setTransactions(transactionsData || []);
      } catch (transactionError) {
        console.error('Failed to refresh transactions (non-blocking):', transactionError);
        setTransactions([]);
      }
      
      toast.success('Dashboard data refreshed!');
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
      toast.error('Failed to refresh wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: string) => {
    return (parseFloat(amount) / 100).toFixed(2); // Convert from cents to dollars
  };

  // Helper function to get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return ArrowDownLeft;
      case 'withdrawal':
        return ArrowUpLeft;
      case 'purchase':
        return ShoppingBag;
      default:
        return CreditCard;
    }
  };

  // View transaction detail
  const viewTransaction = async (transactionId: string) => {
    try {
      const transaction = await api.getTransaction(transactionId);
      // For now, just show an alert with transaction details
      // In a real app, you'd navigate to a detail page or show a modal
      alert(`Transaction Details:
ID: ${transaction.id}
Type: ${transaction.type}
Amount: ${formatCurrency(transaction.amount)}
Status: ${transaction.status}
Description: ${transaction.description}
Date: ${new Date(transaction.created_at).toLocaleString()}`);
    } catch (error) {
      console.error('Failed to load transaction details:', error);
      // Don't show error toast for individual transaction clicks
      console.log('Transaction details not available');
    }
  };

  // Navigate to full transaction list
  const viewAllTransactions = () => {
    // In a real app, you'd navigate to a transactions page
    // For now, just show a toast
    toast.success('Navigate to full transaction history (feature coming soon)');
  };

  // Show loading state
  if (loading && !wallet) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px', 
        gap: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(16px, 4vw, 20px)',
        textAlign: 'center'
      }}>
        <div>
          <Loader2 size={48} className="animate-spin" color="#00f2ff" style={{ marginBottom: '16px' }} />
          <h3 style={{ 
            fontSize: 'clamp(20px, 5vw, 24px)', 
            fontWeight: '900', 
            marginBottom: 'clamp(8px, 2vw, 12px)' 
          }}>
            Loading Dashboard...
          </h3>
          <p style={{ 
            color: '#a0a0b8', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            lineHeight: '1.4',
            maxWidth: '400px'
          }}>
            Fetching your wallet and transaction data
          </p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Failed to load dashboard</h3>
        <button onClick={refreshData}>Try Again</button>
      </div>
    );
  }
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
      style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 6vw, 32px)' }}
    >
      {/* Header with Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: '900', marginBottom: '4px' }}>Dashboard Overview</h2>
          <p style={{ color: '#a0a0b8', fontSize: 'clamp(14px, 3vw, 16px)' }}>Your wallet and transaction summary</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={loading}
          style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '8px 12px', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontWeight: '700', 
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div variants={item}>
          <StatCard 
            label="Available Balance" 
            value={`$${formatCurrency(wallet.available_balance)}`} 
            icon={CreditCard} 
            color="#00f2ff" 
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            label="Total Balance" 
            value={`$${formatCurrency(wallet.balance)}`} 
            icon={ShoppingBag} 
            color="#ff00f2" 
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            label="Total Deposited" 
            value={`$${formatCurrency(wallet.total_deposited)}`} 
            icon={ArrowDownLeft} 
            color="#10b981" 
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            label="Total Withdrawn" 
            value={`$${formatCurrency(wallet.total_withdrawn)}`} 
            icon={ArrowUpLeft} 
            color="#f59e0b" 
          />
        </motion.div>
      </div>

      <div className="main-grid">
        {/* Recent Activity */}
        <motion.div variants={item} style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
          <SectionHeader title="Recent Transactions" action="View All" onActionClick={viewAllTransactions} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const TransactionIcon = getTransactionIcon(transaction.type);
                const statusColor = '#a0a0b8'; // Default color for transaction status
                const amount = formatCurrency(transaction.amount);
                const isPositive = ['deposit', 'refund'].includes(transaction.type);
                
                return (
                  <div 
                    key={transaction.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      padding: '16px', 
                      borderRadius: '16px', 
                      backgroundColor: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className="hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)]"
                    onClick={() => viewTransaction(transaction.id)}
                  >
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      backgroundColor: '#1a1a24', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: isPositive ? '#10b981' : '#f59e0b' 
                    }}>
                      <TransactionIcon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                        {transaction.description || `${transaction.type} Transaction`}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#a0a0b8' }}>
                        {transaction.reference ? `Ref: ${transaction.reference} • ` : ''}
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '700',
                        color: isPositive ? '#10b981' : '#f59e0b'
                      }}>
                        {isPositive ? '+' : '-'}${amount}
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        color: statusColor, 
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: '#a0a0b8' 
              }}>
                <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  No Transactions Yet
                </h4>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  Your transaction history will appear here once you make your first deposit or purchase.
                </p>
              </div>
            )}
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
