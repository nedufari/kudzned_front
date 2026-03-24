import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  CheckCircle2, 
  Info,
  Clock,
  History,
  AlertTriangle,
  QrCode,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { toast } from '../utils/toast';

const CryptoOption = ({ name, symbol, icon: Icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '24px',
      borderRadius: '24px',
      backgroundColor: active ? '#00f2ff' : '#0d0d12',
      color: active ? '#000' : 'white',
      border: active ? 'none' : '1px solid rgba(255,255,255,0.05)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    }}
  >
    <div style={{ backgroundColor: active ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
      <Icon size={32} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontWeight: '800', fontSize: '18px' }}>{name}</p>
      <p style={{ fontSize: '12px', opacity: active ? 0.7 : 0.5 }}>{symbol}</p>
    </div>
  </button>
);

const Topup: React.FC = () => {
  const [method, setMethod] = useState<'BTC' | 'ETH'>('BTC');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topupData, setTopupData] = useState<{
    BTC?: {
      address: string;
      amount_requested?: number;
      expires_at: string;
    };
    ETH?: {
      address: string;
      amount_requested?: number;
      expires_at: string;
    };
  }>({});
  const handleCopy = () => {
    const currentAddress = topupData[method]?.address;
    if (currentAddress) {
      navigator.clipboard.writeText(currentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reset amount when currency changes, but keep address data
  useEffect(() => {
    setAmount('');
  }, [method]);

  const generateAddress = async () => {
    if (!amount || parseInt(amount) < 1) {
      toast.error('Please enter a valid amount (minimum $1)');
      return;
    }

    setLoading(true);
    try {
      const data = await api.createTopup(method, parseInt(amount));
      setTopupData(prev => ({
        ...prev,
        [method]: {
          address: data.address,
          amount_requested: data.amount_requested,
          expires_at: data.expires_at
        }
      }));
      toast.success('Deposit address generated successfully!');
    } catch (error) {
      console.error('Failed to generate address:', error);
      toast.error('Failed to generate deposit address');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-[1.5fr_1fr] lg:gap-8">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="sm:gap-8">
        {/* Method Selection */}
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }} className="sm:text-xl sm:mb-5">Select Deposit Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="sm:gap-4">
            <CryptoOption 
              name="Bitcoin" 
              symbol="BTC" 
              icon={({ size }: any) => <span style={{ fontSize: size }}>₿</span>} 
              active={method === 'BTC'} 
              onClick={() => setMethod('BTC')} 
            />
            <CryptoOption 
              name="Ethereum" 
              symbol="ETH" 
              icon={({ size }: any) => <span style={{ fontSize: size, fontWeight: 'bold' }}>Ξ</span>} 
              active={method === 'ETH'} 
              onClick={() => setMethod('ETH')} 
            />
          </div>
        </section>

        {/* Deposit Interface */}
        <motion.div 
          key={method}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            backgroundColor: '#0d0d12', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '24px', 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}
          className="sm:p-10 sm:gap-8"
        >
          {/* Amount Input */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }} className="sm:text-xl">Enter Amount</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }} className="sm:gap-4">
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="number"
                  placeholder={`Amount in USD (min $1)`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    backgroundColor: '#16161e',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    padding: '16px',
                    color: 'white',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  className="focus:border-[#00f2ff]"
                  min="1"
                />
                <span style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b6b7d',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  USD
                </span>
              </div>
              <button
                onClick={generateAddress}
                disabled={loading || !amount || parseInt(amount) < 1}
                style={{
                  backgroundColor: loading ? '#6b6b7d' : '#00f2ff',
                  color: loading ? '#a0a0b8' : '#000',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: loading || !amount || parseInt(amount) < 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '120px',
                  justifyContent: 'center'
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Generate'}
              </button>
            </div>
          </div>

          {/* QR Code and Address */}
          {topupData[method]?.address && (
            <>
              <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '20px', position: 'relative' }} className="sm:p-4">
                <QrCode size={140} color="#000" className="sm:w-[180px] sm:h-[180px]" />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #00f2ff' }} className="sm:w-10 sm:h-10">
                    <span style={{ fontWeight: '900', color: '#00f2ff', fontSize: '14px' }} className="sm:text-base">W</span>
                  </div>
                </div>
              </div>

          <div style={{ textAlign: 'center', width: '100%' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }} className="sm:text-lg">Send {method} to address</h4>
              <div style={{ 
                backgroundColor: '#16161e', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '14px', 
                padding: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                width: '100%',
                cursor: topupData[method]?.address ? 'pointer' : 'default'
              }} 
              className="sm:p-4 sm:gap-3"
              onClick={topupData[method]?.address ? handleCopy : undefined}>
                <p style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: topupData[method]?.address ? '#00f2ff' : '#6b6b7d' }} className="sm:text-sm">
                  {topupData[method]?.address || 'Generate address to continue'}
                </p>
                {topupData[method]?.address && (copied ? <CheckCircle2 size={18} className="text-[#10b981]" /> : <Copy size={18} className="text-[#a0a0b8]" />)}
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <div style={{ backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px' }} className="sm:p-4 sm:gap-3">
                <AlertTriangle size={18} className="text-[#f59e0b] shrink-0 sm:w-5 sm:h-5" />
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '2px' }} className="sm:text-xs">Important</p>
                  <p style={{ fontSize: '11px', color: '#a0a0b8', lineHeight: '1.4' }} className="sm:text-xs">Only send {method} to this address. Credits after 1 confirmation.</p>
                </div>
              </div>
            </div>
            </>
          )}
          </motion.div>
      </div>

      {/* History & Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="sm:gap-6">
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px' }} className="sm:p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="sm:mb-5">
            <h3 style={{ fontSize: '16px', fontWeight: '700' }} className="sm:text-lg">Recent Deposits</h3>
            <History size={18} className="text-[#a0a0b8]" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#a0a0b8' }} className="sm:py-10">
              <Clock size={28} style={{ margin: '0 auto 12px', opacity: 0.3 }} className="sm:w-8 sm:h-8" />
              <p style={{ fontSize: '13px' }} className="sm:text-sm">No recent transactions found.</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#16161e', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }} className="sm:p-6">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }} className="sm:text-lg sm:mb-4">
            <Info size={18} className="text-[#00f2ff]" />
            How it works
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="sm:gap-4">
            <li style={{ display: 'flex', gap: '10px' }} className="sm:gap-3">
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(0,242,255,0.1)', color: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }} className="sm:w-6 sm:h-6 sm:text-xs">1</div>
              <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: '1.5' }} className="sm:text-sm">Select your preferred cryptocurrency.</p>
            </li>
            <li style={{ display: 'flex', gap: '10px' }} className="sm:gap-3">
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(0,242,255,0.1)', color: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }} className="sm:w-6 sm:h-6 sm:text-xs">2</div>
              <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: '1.5' }} className="sm:text-sm">Send any amount to the generated address.</p>
            </li>
            <li style={{ display: 'flex', gap: '10px' }} className="sm:gap-3">
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(0,242,255,0.1)', color: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }} className="sm:w-6 sm:h-6 sm:text-xs">3</div>
              <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: '1.5' }} className="sm:text-sm">Credits will be added automatically to your wallet after 1 confirmation.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topup;
