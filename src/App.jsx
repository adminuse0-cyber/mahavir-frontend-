import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import MerchantDashboard from './pages/MerchantDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminWorkerActivity from './pages/AdminWorkerActivity'
import AdminMerchantBills from './pages/AdminMerchantBills'
import AdminMerchants from './pages/AdminMerchants'
import AdminBillEdit from './pages/AdminBillEdit'
import AdminBillView from './pages/AdminBillView'
import AdminWorkEdit from './pages/AdminWorkEdit'
import MerchantSummary from './pages/MerchantSummary'
import MerchantInvoice from './pages/MerchantInvoice'
import WorkerList from './pages/WorkerList'
import Products from './pages/Products'
import Contact from './pages/Contact'
import About from './pages/About'
import Search from './pages/Search'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
// import other pages as they are created

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Placeholder components for now, we will create them in next steps */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/owner_dashboard" element={<OwnerDashboard />} />
        <Route path="/merchant_dashboard" element={<MerchantDashboard />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/admin_worker_activity" element={<AdminWorkerActivity />} />
        <Route path="/admin_work_edit/:id" element={<AdminWorkEdit />} />
        <Route path="/admin_merchant_bills" element={<AdminMerchantBills />} />
        <Route path="/admin_merchants" element={<AdminMerchants />} />
        <Route path="/admin_bill_edit/:id" element={<AdminBillEdit />} />
        <Route path="/admin_bill_view/:id" element={<AdminBillView />} />
        
        <Route path="/merchant_summary" element={<MerchantSummary />} />
        <Route path="/merchant_invoice/:id" element={<MerchantInvoice />} />
        <Route path="/worker_list" element={<WorkerList />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:category/:productName" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
