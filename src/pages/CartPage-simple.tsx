import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cart Page</h1>
      <p>This is a simple cart page to test if routing works.</p>
      <button 
        onClick={() => navigate('/checkout')}
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
        Go to Checkout
      </button>
    </div>
  );
};

export default CartPage;