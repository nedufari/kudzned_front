import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Wallet, 
  ShieldCheck, 
  Lock, 
  Camera, 
  CheckCircle2, 
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react';

const Profile: React.FC = () => {
  const [name, setName] = useState('Nedu Franco');
  const [address, setAddress] = useState('bc1qxy2kg2ryyxpx4lhuv067z8483m3m3j');
  const email = 'nedufranco@gmail.com';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-10">
      {/* Left - Personal Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="sm:gap-8">
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} className="sm:p-10">
          <div style={{ position: 'relative', marginBottom: '20px' }} className="sm:mb-6">
            <div style={{ width: '100px', height: '100px', borderRadius: '32px', border: '3px solid #00f2ff', padding: '4px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:scale-110 sm:w-[120px] sm:h-[120px]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nedu" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '24px' }} className="sm:rounded-3xl" />
            </div>
            <button style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#00f2ff', color: '#000', padding: '8px', borderRadius: '12px', border: '4px solid #0d0d12' }} className="sm:p-2">
              <Camera size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }} className="sm:text-2xl">{name}</h3>
          <p style={{ color: '#a0a0b8', fontSize: '14px', marginBottom: '20px' }} className="sm:text-sm">Member since Oct 2024</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: '800', backgroundColor: 'rgba(16,185,129,0.1)', padding: '8px 16px', borderRadius: '12px' }} className="sm:text-sm">
             <ShieldCheck size={16} />
             Verified Investor
          </div>
        </div>

        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px' }} className="sm:p-8">
          <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }} className="sm:text-lg">Security Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="sm:gap-5">
             {[
               { icon: Mail, label: 'Email Verified', status: 'Completed', color: '#10b981' },
               { icon: ShieldCheck, label: '2FA Auth', status: 'Disabled', color: '#ff4b4b' },
               { icon: Lock, label: 'Withdrawal Pin', status: 'Active', color: '#10b981' }
             ].map((item, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="sm:gap-4">
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', color: '#a0a0b8' }} className="sm:p-2">
                    <item.icon size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '800' }} className="sm:text-sm">{item.label}</p>
                    <p style={{ fontSize: '11px', color: item.color, fontWeight: '700' }} className="sm:text-xs">{item.status}</p>
                  </div>
                  <ChevronRight size={16} color="#6b6b7d" className="sm:w-4 sm:h-4" />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Right - Profile Edit Form */}
      <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="sm:p-10 sm:gap-8">
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }} className="sm:text-2xl">Edit Profile Information</h3>
          <p style={{ color: '#a0a0b8', fontSize: '14px' }} className="sm:text-sm">Update your personal details and wallet addresses.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="sm:gap-6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="sm:text-xs">Full Name</label>
            <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} className="sm:p-4 sm:gap-3">
              <User size={16} color="#00f2ff" className="sm:w-5 sm:h-5" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '14px' }} className="sm:text-base" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="sm:text-xs">Email Address</label>
            <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(0,242,255,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} className="sm:p-4 sm:gap-3">
              <Mail size={16} color="#00f2ff" className="sm:w-5 sm:h-5" />
              <input type="email" value={email} readOnly style={{ background: 'none', border: 'none', outline: 'none', color: '#a0a0b8', width: '100%', fontSize: '14px', cursor: 'not-allowed' }} className="sm:text-base" />
              <CheckCircle2 size={16} color="#10b981" className="sm:w-5 sm:h-5" />
            </div>
            <p style={{ fontSize: '11px', color: '#6b6b7d' }} className="sm:text-xs">Verified email cannot be changed. Contact support for help.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="sm:text-xs">Default BTC Wallet Address</label>
            <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} className="sm:p-4 sm:gap-3">
              <Wallet size={16} color="#f59e0b" className="sm:w-5 sm:h-5" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '14px', fontFamily: 'monospace' }} className="sm:text-base" />
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="sm:flex-row sm:gap-4">
            <button style={{ flex: 1, backgroundColor: '#00f2ff', color: '#000', padding: '14px', borderRadius: '14px', fontWeight: '900', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="sm:text-base sm:p-4">
               <Save size={18} className="sm:w-5 sm:h-5" />
               Save Profile
            </button>
            <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '14px', fontWeight: '700', fontSize: '14px' }} className="sm:text-base sm:p-4">
               Cancel
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '24px', marginTop: '8px' }}>
           <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#ff4b4b', marginBottom: '12px' }} className="sm:text-sm">Danger Zone</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255,75,75,0.05)', border: '1px solid rgba(255,75,75,0.1)', padding: '16px', borderRadius: '16px' }} className="sm:flex-row sm:justify-between sm:items-center sm:p-5">
              <div>
                <p style={{ fontSize: '14px', fontWeight: '800' }} className="sm:text-sm">Deactivate Account</p>
                <p style={{ fontSize: '12px', color: '#a0a0b8' }} className="sm:text-xs">This will instantly disable your access to KUDZNED.</p>
              </div>
              <button style={{ backgroundColor: '#ff4b4b', color: 'white', padding: '10px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} className="sm:text-sm">
                 <Trash2 size={16} className="sm:w-4 sm:h-4" />
                 Terminate
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
