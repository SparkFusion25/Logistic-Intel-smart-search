
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Landing from './routes/Landing'
import Pricing from './routes/Pricing'
import Search from './routes/Search'
import Company from './routes/Company'
import Email from './routes/Email'
import Campaigns from './routes/Campaigns'
import CampaignAnalytics from './routes/CampaignAnalytics'
import Quote from './routes/Widgets/Quote'
import Tariff from './routes/Widgets/Tariff'
import Admin from './routes/Admin'
import Dashboard from './routes/Dashboard'
import Import from './routes/Import'
import './styles/globals.css'

const router = createBrowserRouter([
  { path: '/', element: <Landing/> },
  { path: '/pricing', element: <Pricing/> },
  { path: '/app/dashboard', element: <Dashboard/> },
  { path: '/app/search', element: <Search/> },
  { path: '/app/company/:companyId', element: <Company/> },
  { path: '/app/email', element: <Email/> },
  { path: '/app/campaigns', element: <Campaigns/> },
  { path: '/app/campaigns/analytics', element: <CampaignAnalytics/> },
  { path: '/app/widgets/quote', element: <Quote/> },
  { path: '/app/widgets/tariff', element: <Tariff/> },
  { path: '/app/admin', element: <Admin/> },
  { path: '/app/import', element: <Import/> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
)
