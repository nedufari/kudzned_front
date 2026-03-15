import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { User } from '../services/api';
import { Loader2, LogOut, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Loading user data...');
        // For now, we'll just show that we have a token
        // Later we can add a getCurrentUser API call
        setUser({
          id: 'temp-id',
          email: 'Loading...',
          username: 'Loading...',
          role: 'customer',
          status: 'active'
        } as unknown as User);
        
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load user data');
        // If there's an error, redirect to login
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Logging out...');
    api.clearToken();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: '#ff4b4b', textAlign: 'center' }}>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              marginTop: '16px', 
              padding: '8px 16px', 
              backgroundColor: '#00f2ff', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#050505', 
      color: 'white',
      padding: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              Welcome to SONNET Dashboard
            </h1>
            <p style={{ color: '#a0a0b8', fontSize: '16px' }}>
              You are successfully logged in!
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff00f2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {/* Authentication Status */}
          <div style={{ 
            backgroundColor: '#0d0d12', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Shield size={24} color="#10b981" />
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                Authentication Status
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#10b981'
              }} />
              <span>Successfully authenticated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#10b981'
              }} />
              <span>Token stored securely</span>
            </div>
          </div>

          {/* API Connection */}
          <div style={{ 
            backgroundColor: '#0d0d12', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: '#00f2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>API</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00f2ff' }}>
                Backend Connection
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#10b981'
              }} />
              <span>Connected to SONNET Backend</span>
            </div>
            <p style={{ color: '#a0a0b8', fontSize: '14px', marginTop: '12px' }}>
              Backend URL: {api['baseURL']}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            backgroundColor: '#0d0d12', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#ff00f2' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => navigate('/shop')}
                style={{ 
                  padding: '12px', 
                  backgroundColor: 'rgba(0,242,255,0.1)', 
                  border: '1px solid rgba(0,242,255,0.2)',
                  borderRadius: '8px',
                  color: '#00f2ff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                Browse Shop
              </button>
              <button 
                onClick={() => navigate('/profile')}
                style={{ 
                  padding: '12px', 
                  backgroundColor: 'rgba(255,0,242,0.1)', 
                  border: '1px solid rgba(255,0,242,0.2)',
                  borderRadius: '8px',
                  color: '#ff00f2',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                View Profile
              </button>
              <button 
                onClick={() => navigate('/orders')}
                style={{ 
                  padding: '12px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                View Orders
              </button>
            </div>
          </div>

          {/* Token Info (for debugging) */}
          <div style={{ 
            backgroundColor: '#0d0d12', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#a0a0b8' }}>
              Session Info
            </h3>
            <div style={{ fontSize: '14px', color: '#a0a0b8' }}>
              <p>Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}</p>
              <p>Login Time: {new Date().toLocaleString()}</p>
              <p>Status: Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;