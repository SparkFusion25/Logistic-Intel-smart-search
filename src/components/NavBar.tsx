import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export default function NavBar(){
  return (
    <header className='sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-3'>
          <Logo variant="mark" className='h-8 w-8 text-[#0F4C81]'/>
          <span className='font-semibold text-[#0B1E39] text-lg'>Logistic Intel</span>
        </Link>
        <nav className='hidden md:flex items-center gap-6'>
          {[
            {to:'/',label:'Home'},
            {to:'/about',label:'About'},
            {to:'/pricing',label:'Pricing'},
            {to:'/blog',label:'Blog'}
          ].map(i=> (
            <NavLink 
              key={i.to} 
              to={i.to} 
              className={({isActive})=>`text-sm font-medium transition-colors ${isActive?'text-[#0F4C81]':'text-slate-700 hover:text-[#0F4C81]'}`}
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className='flex items-center gap-3'>
          <Link to='/auth/login' className='text-sm font-semibold text-slate-700 hover:text-[#0F4C81] transition-colors'>Log in</Link>
          <Link to='/auth/signup' className='inline-flex items-center rounded-xl px-4 py-2 text-white text-sm font-semibold bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] shadow-lg hover:brightness-110 transition'>Start free</Link>
        </div>
      </div>
    </header>
  );
}