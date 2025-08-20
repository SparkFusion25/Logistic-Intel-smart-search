import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/Container';
import MobileMenu from './MobileMenu';

export default function ImportGeniusHeader() {
  return (
    <header className='sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200'>
      <Container>
        <div className='flex items-center justify-between py-4'>
          <Link to='/' className='flex items-center gap-3'>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LI</span>
            </div>
            <span className='text-xl font-semibold text-gray-900'>Logistic Intel</span>
          </Link>
          
          <nav className='hidden md:flex items-center gap-8'>
            <Link to='/products' className='text-gray-600 hover:text-gray-900 font-medium'>
              Products
            </Link>
            <Link to='/pricing' className='text-gray-600 hover:text-gray-900 font-medium'>
              Pricing
            </Link>
            <Link to='/resources' className='text-gray-600 hover:text-gray-900 font-medium'>
              Resources
            </Link>
            <Link to='/about' className='text-gray-600 hover:text-gray-900 font-medium'>
              About
            </Link>
          </nav>
          
          <div className='flex items-center gap-3'>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Sign in
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Request demo
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}