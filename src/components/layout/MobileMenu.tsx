import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <button
        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block py-3 text-base font-medium text-gray-600 hover:text-gray-900 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-6 space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Button>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Request demo
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}