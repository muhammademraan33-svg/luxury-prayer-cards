import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Home } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const [user, setUser] = useState<{ id?: string; email?: string; user_metadata?: { user_type?: string } } | null>(null)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata as { user_type?: string },
        })
      } else {
        setUser(null)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata as { user_type?: string },
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" aria-label="Luxury Prayer Cards home">
            <Home className="h-6 w-6 text-primary-600" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900">Luxury Prayer Cards</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/design" className="text-gray-700 hover:text-primary-600 transition">
              Design
            </Link>
            <Link to="/funeral-home" className="text-gray-700 hover:text-primary-600 transition">
              Funeral Home Portal
            </Link>
            {user?.user_metadata?.user_type === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
              aria-label={`Cart with ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            >
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-700" aria-hidden="true" />
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-primary-600 transition"
                  type="button"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                to="/funeral-home"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
