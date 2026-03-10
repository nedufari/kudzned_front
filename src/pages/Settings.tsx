import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  Shield, 
  Smartphone, 
  Layout,
  MousePointer2,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SettingToggle = ({ icon: Icon, label, description, checked, onChange }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} className="sm:p-6">
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }} className="sm:gap-4">
       <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', color: '#00f2ff' }} className="sm:p-3">
         <Icon size={18} className="sm:w-5 sm:h-5" />
       </div>
       <div style={{ flex: 1 }}>
         <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }} className="sm:text-base">{label}</p>
         <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: '1.4' }} className="sm:text-xs">{description}</p>
       </div>
    </div>
    <div 
      onClick={onChange}
      style={{ 
        width: '48px', 
        height: '28px', 
        borderRadius: '100px', 
        backgroundColor: checked ? '#00f2ff' : '#0d0d12', 
        border: '2px solid rgba(255,255,255,0.1)',
        padding: '3px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}
      className="sm:w-14 sm:h-8"
    >
      <div style={{ 
        width: '18px', 
        height: '18px', 
        borderRadius: '50%', 
        backgroundColor: checked ? '#000' : '#a0a0b8', 
        transform: `translateX(${checked ? '20px' : '0px'})`,
        transition: 'all 0.3s'
      }} 
      className="sm:w-6 sm:h-6"
      />
    </div>
  </div>
);

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    privateMode: false,
    twoFactor: true,
    emailAlerts: true,
    showBalance: true,
    highContrast: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }} className="sm:gap-8">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }} className="sm:text-2xl">Security & Account Settings</h3>
        <p style={{ color: '#a0a0b8', fontSize: '14px' }} className="sm:text-sm">Configure your privacy, security, and interface preferences on KUDZNED.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="sm:grid sm:grid-cols-2 sm:gap-6">
         {/* Security Settings */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="sm:gap-6">
            <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }} className="sm:text-sm">
              <Shield size={16} className="sm:w-4 sm:h-4" />
              Security
            </h4>
            <SettingToggle 
              icon={Smartphone} 
              label="Two-Factor Auth" 
              description="Protect your account with a secondary verification code."
              checked={settings.twoFactor}
              onChange={() => toggle('twoFactor')}
            />
            <SettingToggle 
              icon={Lock} 
              label="New Login Alerts" 
              description="Get notified if someone logs in from a new IP."
              checked={settings.emailAlerts}
              onChange={() => toggle('emailAlerts')}
            />
            <div style={{ backgroundColor: 'rgba(255,180,0,0.05)', border: '1px solid rgba(255,180,0,0.1)', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px' }} className="sm:p-5 sm:gap-4">
               <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0 }} className="sm:w-5 sm:h-5" />
               <div>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: '#f59e0b' }} className="sm:text-sm">Password expires in 42 days</p>
                  <p style={{ fontSize: '11px', color: '#a0a0b8', lineHeight: '1.4' }} className="sm:text-xs">Consider changing it regularly for maximum security.</p>
               </div>
            </div>
         </div>

         {/* Privacy & UI */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="sm:gap-6">
            <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }} className="sm:text-sm">
              <Eye size={16} className="sm:w-4 sm:h-4" />
              Privacy & Display
            </h4>
            <SettingToggle 
              icon={Eye} 
              label="Private Mode" 
              description="Hide your purchase history and vouches from other users."
              checked={settings.privateMode}
              onChange={() => toggle('privateMode')}
            />
            <SettingToggle 
              icon={Layout} 
              label="Show Wallet Balance" 
              description="Display your current balance in the sidebar and header."
              checked={settings.showBalance}
              onChange={() => toggle('showBalance')}
            />
            <SettingToggle 
              icon={MousePointer2} 
              label="Advanced Contrast" 
              description="Premium high-contrast dark mode for better visibility."
              checked={settings.highContrast}
              onChange={() => toggle('highContrast')}
            />
         </div>
      </div>

       <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="sm:flex-row sm:justify-between sm:items-center sm:p-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="sm:gap-4">
             <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '14px', color: '#10b981' }} className="sm:p-3">
                <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
             </div>
             <div>
               <p style={{ fontSize: '15px', fontWeight: '900' }} className="sm:text-base">Session Identity: Verified</p>
               <p style={{ fontSize: '12px', color: '#a0a0b8' }} className="sm:text-xs">Your connection to KUDZNED is encrypted with RSA-4096.</p>
             </div>
          </div>
          <button style={{ color: '#00f2ff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }} className="hover:underline sm:text-sm">
             Audit Sessions
             <ChevronRight size={16} className="sm:w-4 sm:h-4" />
          </button>
       </div>
    </div>
  );
};

export default Settings;
