import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, TrendingUp, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Feed', icon: <Home className="w-5 h-5 mr-2" /> },
    { path: '/top-users', label: 'Top Users', icon: <Users className="w-5 h-5 mr-2" /> },
    { path: '/trending', label: 'Trending Posts', icon: <TrendingUp className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">SocialAnalytics</h1>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-2 px-3 rounded-md transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 font-medium'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      {/* Mobile navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col space-y-2">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 rounded-md transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 font-medium'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 SocialAnalytics Dashboard</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;