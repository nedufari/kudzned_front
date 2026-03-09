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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '40px', alignItems: 'start' }}>
      {/* Left - Personal Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '40px', border: '3px solid #00f2ff', padding: '4px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:scale-110">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nedu" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '32px' }} />
            </div>
            <button style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#00f2ff', color: '#000', padding: '10px', borderRadius: '15px', border: '4px solid #0d0d12' }}>
              <Camera size={20} />
            </button>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>{name}</h3>
          <p style={{ color: '#a0a0b8', fontSize: '15px', marginBottom: '24px' }}>Member since Oct 2024</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: '800', backgroundColor: 'rgba(16,185,129,0.1)', padding: '8px 16px', borderRadius: '12px' }}>
             <ShieldCheck size={16} />
             Verified Investor
          </div>
        </div>

        <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Security Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             {[
               { icon: Mail, label: 'Email Verified', status: 'Completed', color: '#10b981' },
               { icon: ShieldCheck, label: '2FA Auth', status: 'Disabled', color: '#ff4b4b' },
               { icon: Lock, label: 'Withdrawal Pin', status: 'Active', color: '#10b981' }
             ].map((item, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', color: '#a0a0b8' }}>
                    <item.icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '800' }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: item.color, fontWeight: '700' }}>{item.status}</p>
                  </div>
                  <ChevronRight size={18} color="#6b6b7d" />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Right - Profile Edit Form */}
      <div style={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Edit Profile Information</h3>
          <p style={{ color: '#a0a0b8', fontSize: '15px' }}>Update your personal details and wallet addresses.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={18} color="#00f2ff" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(0,242,255,0.2)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} color="#00f2ff" />
              <input type="email" value={email} readOnly style={{ background: 'none', border: 'none', outline: 'none', color: '#a0a0b8', width: '100%', fontSize: '16px', cursor: 'not-allowed' }} />
              <CheckCircle2 size={18} color="#10b981" />
            </div>
            <p style={{ fontSize: '12px', color: '#6b6b7d' }}>Verified email cannot be changed. Contact support for help.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '800', color: '#6b6b7d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default BTC Wallet Address</label>
            <div style={{ backgroundColor: '#16161e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Wallet size={18} color="#f59e0b" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px', fontFamily: 'monospace' }} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
            <button style={{ flex: 1, backgroundColor: '#00f2ff', color: '#000', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
               <Save size={20} />
               Save Profile
            </button>
            <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '16px', borderRadius: '16px', fontWeight: '700', fontSize: '16px' }}>
               Cancel
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '32px', marginTop: '8px' }}>
           <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#ff4b4b', marginBottom: '12px' }}>Danger Zone</h4>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,75,75,0.05)', border: '1px solid rgba(255,75,75,0.1)', padding: '20px', borderRadius: '20px' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '800' }}>Deactivate Account</p>
                <p style={{ fontSize: '13px', color: '#a0a0b8' }}>This will instantly disable your access to KUDZNED.</p>
              </div>
              <button style={{ backgroundColor: '#ff4b4b', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Trash2 size={18} />
                 Terminate
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
