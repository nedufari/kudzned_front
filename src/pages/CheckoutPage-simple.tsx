import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Checkout Page</h1>
      <p>This is a simple checkout page to test if routing works.</p>
      <button 
        onClick={() => navigate('/success')}
        style={{ 
          backgroundColor: '#00f2ff', 
          color: '#000', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Complete Payment
      </button>
    </div>
  );
};

export default CheckoutPage;