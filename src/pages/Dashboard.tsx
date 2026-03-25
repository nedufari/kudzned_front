import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  ShoppingBag, 
  ArrowUpRight, 
  CreditCard,
  Loader2,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpLeft,
  Clock,
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
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  const ITEMS_PER_PAGE = 10;

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
        await loadTransactions(1);
        
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
        setDisplayedTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Load transactions with pagination
  const loadTransactions = async (page: number, append: boolean = false) => {
    try {
      const response = await api.getTransactions({ 
        page: page, 
        limit: ITEMS_PER_PAGE 
      });
      
      // Handle the API response structure
      let transactionsData: Transaction[] = [];
      let pages = 1;
      let hasNext = false;
      
      if (Array.isArray(response)) {
        // Direct array response (fallback)
        transactionsData = response as Transaction[];
        hasNext = false;
      } else if (response && typeof response === 'object') {
        // Standard API response with data and metadata
        const apiResponse = response as { 
          data?: Transaction[]; 
          metadata?: { 
            total?: number; 
            pages?: number; 
            hasNext?: boolean;
            page?: number;
          } 
        };
        
        if (apiResponse.data && Array.isArray(apiResponse.data)) {
          transactionsData = apiResponse.data;
          pages = apiResponse.metadata?.pages || 1;
          hasNext = apiResponse.metadata?.hasNext || false;
        }
      }
      
      if (append) {
        // Append new transactions to existing ones
        setDisplayedTransactions(prev => [...prev, ...transactionsData]);
      } else {
        // Replace existing transactions
        setDisplayedTransactions(transactionsData);
      }
      
      setTotalPages(pages);
      setHasNextPage(hasNext);
      setCurrentPage(page);
    } catch (transactionError) {
      console.error('Failed to load transactions:', transactionError);
      if (!append) {
        setDisplayedTransactions([]);
      }
      setTotalPages(1);
      setHasNextPage(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      // Load wallet first
      const walletData = await api.getWallet();
      setWallet(walletData);
      
      // Load transactions from page 1
      await loadTransactions(1);
      
      toast.success('Dashboard data refreshed!');
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
      toast.error('Failed to refresh wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Load more transactions (View More)
  const loadMoreTransactions = async () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      await loadTransactions(nextPage, true);
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
    // Load more transactions on the dashboard
    loadMoreTransactions();
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

      </div>

      <div style={{ width: '100%' }}>
        {/* Recent Activity */}
        <motion.div variants={item} style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', width: '100%' }}>
          <SectionHeader 
            title="Recent Transactions" 
            action={hasNextPage ? "View All" : undefined} 
            onActionClick={hasNextPage ? viewAllTransactions : undefined} 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedTransactions.length > 0 ? (
              <>
                {displayedTransactions.map((transaction) => {
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
                        gap: 'clamp(12px, 3vw, 16px)', 
                        padding: 'clamp(12px, 3vw, 16px)', 
                        borderRadius: '16px', 
                        backgroundColor: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        minWidth: 0
                      }}
                      className="hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)]"
                      onClick={() => viewTransaction(transaction.id)}
                    >
                      <div style={{ 
                        width: 'clamp(40px, 10vw, 48px)', 
                        height: 'clamp(40px, 10vw, 48px)', 
                        borderRadius: '12px', 
                        backgroundColor: '#1a1a24', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: isPositive ? '#10b981' : '#f59e0b',
                        flexShrink: 0
                      }}>
                        <TransactionIcon size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <h4 style={{ 
                          fontSize: 'clamp(14px, 3.5vw, 16px)', 
                          fontWeight: '600', 
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {transaction.description || `${transaction.type} Transaction`}
                        </h4>
                        <p style={{ 
                          fontSize: 'clamp(11px, 3vw, 12px)', 
                          color: '#a0a0b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {transaction.reference ? `Ref: ${transaction.reference} • ` : ''}
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ 
                          fontSize: 'clamp(14px, 3.5vw, 16px)', 
                          fontWeight: '700',
                          color: isPositive ? '#10b981' : '#f59e0b'
                        }}>
                          {isPositive ? '+' : '-'}${amount}
                        </p>
                        <p style={{ 
                          fontSize: 'clamp(11px, 3vw, 12px)', 
                          color: statusColor, 
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {hasNextPage && (
                  <button
                    onClick={loadMoreTransactions}
                    style={{
                      width: '100%',
                      backgroundColor: '#16161e',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '14px',
                      color: '#00f2ff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      transition: 'all 0.2s'
                    }}
                    className="hover:bg-[#1f1f2a]"
                  >
                    View More
                    <ArrowDownLeft size={16} style={{ transform: 'rotate(-45deg)' }} />
                  </button>
                )}
              </>
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


      </div>
    </motion.div>
  );
};

export default Dashboard;
