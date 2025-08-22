import { Link } from 'react-router-dom';

export default function Footer(){
  return (
    <footer className='border-t border-slate-200 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company info */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='h-8 w-8 rounded bg-gradient-to-r from-[#0B1E39] to-[#0F4C81]'></div>
              <span className='font-semibold text-[#0B1E39] text-lg'>Logistic Intel</span>
            </div>
            <p className='text-sm text-slate-600'>
              Global freight intelligence, CRM, and outreach platform for logistics professionals.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900 mb-4'>Product</h3>
            <ul className='space-y-2'>
              <li><Link to='/' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Home</Link></li>
              <li><Link to='/pricing' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Pricing</Link></li>
              <li><Link to='/blog' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Blog</Link></li>
              <li><a href='/demo/request' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Request Demo</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900 mb-4'>Company</h3>
            <ul className='space-y-2'>
              <li><Link to='/about' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>About</Link></li>
              <li><a href='/careers' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Careers</a></li>
              <li><a href='/contact' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Contact</a></li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900 mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li><a href='/legal/privacy' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Privacy Policy</a></li>
              <li><a href='/legal/terms' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Terms of Service</a></li>
              <li><a href='/legal/security' className='text-sm text-slate-600 hover:text-[#0F4C81] transition-colors'>Security</a></li>
            </ul>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-slate-200'>
          <p className='text-xs text-slate-500 text-center'>
            © {new Date().getFullYear()} Logistic Intel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}