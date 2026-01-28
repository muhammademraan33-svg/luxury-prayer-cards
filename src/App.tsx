import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import DesignerPage from './pages/DesignerPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import FuneralHomePortal from './pages/FuneralHomePortal'
import AdminDashboard from './pages/AdminDashboard'
import MemorialPhotoEditor from './pages/MemorialPhotoEditor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function AppContent() {
  return (
    <Router>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-primary-700 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-md"
      >
        Skip to main content
      </a>
      <Routes>
        {/* Designer page without Navbar/Footer */}
        <Route path="/design" element={<DesignerPage />} />
        
        {/* All other pages with Navbar/Footer */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-grow" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/funeral-home" element={<FuneralHomePortal />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/memorial-photo-editor" element={<MemorialPhotoEditor />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
