import { 
  LayoutDashboard, Search, Contact, Mail, Flag, LineChart, 
  FileText, Calculator, Activity, ShieldCheck 
} from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const mobileNavItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "CRM", url: "/dashboard/crm", icon: Contact },
  { title: "Email", url: "/dashboard/email", icon: Mail },
  { title: "Campaigns", url: "/dashboard/campaigns", icon: Flag },
  { title: "Analytics", url: "/dashboard/campaigns/analytics", icon: LineChart },
  { title: "Quote", url: "/dashboard/widgets/quote", icon: FileText },
  { title: "Tariff", url: "/dashboard/widgets/tariff", icon: Calculator },
  { title: "Benchmark", url: "/dashboard/benchmark", icon: Activity },
  { title: "Admin", url: "/dashboard/admin", icon: ShieldCheck },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex overflow-x-auto scrollbar-hide">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/")
          
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[72px] transition-colors duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`h-4 w-4 mb-1 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-[10px] font-medium truncate leading-tight">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}