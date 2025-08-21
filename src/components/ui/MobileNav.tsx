import { LayoutDashboard, Search, Contact, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const mobileNavItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "CRM", url: "/dashboard/crm", icon: Contact },
  { title: "Email", url: "/dashboard/email", icon: Mail },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/")
          
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium truncate">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}