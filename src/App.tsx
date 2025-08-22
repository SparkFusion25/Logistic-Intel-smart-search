
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';
import { supabase } from './lib/supabase';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import ClientErrorHooks from './components/ClientErrorHooks';

export default function App() {
  return (
    <HelmetProvider>
      <SessionContextProvider supabaseClient={supabase}>
        <ClientErrorHooks />
        <RouterProvider router={router} />
      </SessionContextProvider>
    </HelmetProvider>
  );
}
