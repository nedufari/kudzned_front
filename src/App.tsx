import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Topup from './pages/Topup';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Transfers from './pages/Transfers';
import Orders from './pages/Orders';
import Vouches from './pages/Vouches';
import CashoutClips from './pages/CashoutClips';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProductDetail from './pages/ProductDetail';
import OrderDetail from './pages/OrderDetail';
import VouchDetail from './pages/VouchDetail';
import ClipDetail from './pages/ClipDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import Notifications from './pages/Notifications';
import TelegramButton from './components/TelegramButton';

function App() {
  return (
    <Router>
      <TelegramButton />
      <Routes>
        {/* Public Marketing Route */}
        <Route path="/" element={<Landing />} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Authenticated Dashboard Routes (Shared Sidebar Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Shop & Marketplace */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          
          {/* Commerce Flow */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          
          <Route path="/topup" element={<Topup />} />
          <Route path="/transfers" element={<Transfers />} />
          
          {/* Cashout Clips & Details */}
          <Route path="/cashout-clips" element={<CashoutClips />} />
          <Route path="/cashout-clips/:id" element={<ClipDetail />} />
          
          {/* Vouches & Vouch Details */}
          <Route path="/vouches" element={<Vouches />} />
          <Route path="/vouches/:id" element={<VouchDetail />} />
          
          {/* Orders & Order Details */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Catch-all - Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
