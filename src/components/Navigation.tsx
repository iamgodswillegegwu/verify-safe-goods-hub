
import { useState } from 'react';
import { Shield, Menu, X, User, Building2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Shield },
    { label: 'Manufacturer Portal', path: '/manufacturer', icon: Building2 },
    { label: 'Admin Dashboard', path: '/admin', icon: BarChart3 },
    { label: 'Subscription', path: '/subscription', icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">SafeGoods</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-slate-600 hover:text-blue-600"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 py-4">
            <div className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-blue-100 pt-3 mt-3 space-y-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-slate-600 hover:text-blue-600"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
