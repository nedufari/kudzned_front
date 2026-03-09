import React, { useState } from 'react';
import { 
  Copy, 
  CheckCircle2, 
  Info,
  Clock,
  History,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [method, setMethod] = useState('btc');
  const [copied, setCopied] = useState(false);

  const address = method === 'btc' 
    ? 'bc1qxy2kg2ryyxpx4lhuv067z8483m3m3j' 
    : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Method Selection */}
        <section>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Select Deposit Method</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <CryptoOption 
              name="Bitcoin" 
              symbol="BTC" 
              icon={({ size }: any) => <span style={{ fontSize: size }}>₿</span>} 
              active={method === 'btc'} 
              onClick={() => setMethod('btc')} 
            />
            <CryptoOption 
              name="Ethereum" 
              symbol="ETH" 
              icon={({ size }: any) => <span style={{ fontSize: size, fontWeight: 'bold' }}>Ξ</span>} 
              active={method === 'eth'} 
              onClick={() => setMethod('eth')} 
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
            borderRadius: '32px', 
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px'
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '24px', position: 'relative' }}>
            <QrCode size={180} color="#000" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #00f2ff' }}>
                 <span style={{ fontWeight: '900', color: '#00f2ff' }}>W</span>
               </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Send {method.toUpperCase()} to address</h4>
            <div style={{ 
              backgroundColor: '#16161e', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              width: '100%',
              cursor: 'pointer'
            }} onClick={handleCopy}>
              <p style={{ flex: 1, fontFamily: 'monospace', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#00f2ff' }}>
                {address}
              </p>
              {copied ? <CheckCircle2 size={18} className="text-[#10b981]" /> : <Copy size={18} className="text-[#a0a0b8]" />}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={20} className="text-[#f59e0b] shrink-0" />
              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '2px' }}>Important</p>
                <p style={{ fontSize: '11px', color: '#a0a0b8' }}>Only send {method.toUpperCase()} to this address. Credits after 1 confirmation.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* History & Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Deposits</h3>
            <History size={18} className="text-[#a0a0b8]" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#a0a0b8' }}>
              <Clock size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px' }}>No recent transactions found.</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#16161e', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} className="text-[#00f2ff]" />
            How it works
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0,242,255,0.1)', color: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>1</div>
              <p style={{ fontSize: '13px', color: '#a0a0b8' }}>Select your preferred cryptocurrency.</p>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0,242,255,0.1)', color: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>2</div>
              <p style={{ fontSize: '13px', color: '#a0a0b8' }}>Send any amount to the generated address.</p>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0,242,255,0.1)', color: '#00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>3</div>
              <p style={{ fontSize: '13px', color: '#a0a0b8' }}>Credits will be added automatically to your wallet after 1 confirmation.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topup;
