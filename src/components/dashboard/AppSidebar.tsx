import { 
  LayoutDashboard, Search, Contact, Mail, BarChart3, Flag, LineChart, 
  Clock8, Boxes, FileText, Calculator, Activity, ShieldCheck, Settings, HelpCircle, BookOpen, Target, ChevronLeft, ChevronRight 
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarBrand } from "./SidebarBrand"

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "CRM", url: "/dashboard/crm", icon: Contact },
  { title: "Email", url: "/dashboard/email", icon: Mail },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Campaigns", url: "/dashboard/campaigns", icon: Flag },
  { title: "Templates", url: "/dashboard/campaigns/templates", icon: FileText },
  { title: "Campaign Analytics", url: "/dashboard/campaigns/analytics", icon: LineChart },
  { title: "Follow‑Ups", url: "/dashboard/campaigns/follow-ups", icon: Clock8 },
  { title: "Widgets", url: "/dashboard/widgets", icon: Boxes },
  { title: "Quote Generator", url: "/dashboard/widgets/quote", icon: FileText },
  { title: "Tariff Calculator", url: "/dashboard/widgets/tariff", icon: Calculator },
  { title: "Benchmark", url: "/dashboard/widgets/benchmark", icon: Activity },
  { title: "Admin", url: "/dashboard/admin", icon: ShieldCheck },
]

const bottomItems = [
  { title: "Blog", url: "/blog", icon: BookOpen },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()

  return (
    <Sidebar
      side="left"
      variant="sidebar" 
      collapsible="icon"
      className="border-r-0 shadow-2xl transition-all duration-300"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e3a8a 40%, #312e81 100%)',
        width: collapsed ? '72px' : '280px'
      }}
    >
      <SidebarHeader className="p-0 border-b border-white/10">
        <SidebarBrand collapsed={collapsed} toggleSidebar={toggleSidebar} />
      </SidebarHeader>

      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton 
                       asChild
                       tooltip={collapsed ? item.title : undefined}
                       className="relative overflow-hidden transition-all duration-300 mx-2 my-1 rounded-xl text-white/85"
                    >
                      <NavLink to={item.url} className={`flex items-center gap-3 px-3 py-3 relative z-10 ${collapsed ? 'justify-center' : ''}`}>
                        {/* Enhanced Icon Container */}
                         <div className="w-8 h-8 shrink-0 rounded-lg transition-all duration-300 flex items-center justify-center bg-white/10">
                           <item.icon className="w-4 h-4 text-white" />
                         </div>
                        
                        {/* Enhanced Text - Only show when not collapsed */}
                        {!collapsed && (
                           <span className="font-medium truncate text-[15px] leading-5 transition-all duration-300 text-white/90">
                             {item.title}
                           </span>
                        )}
                        
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 bg-transparent">
        <SidebarMenu>
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                 <SidebarMenuButton 
                   asChild
                   tooltip={collapsed ? item.title : undefined}
                   className="transition-all duration-300 mx-2 my-1 rounded-xl text-white/85"
                >
                  <NavLink to={item.url} className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
                     <div className="w-8 h-8 shrink-0 rounded-lg transition-all duration-300 flex items-center justify-center bg-white/10">
                       <item.icon className="w-4 h-4 text-white" />
                     </div>
                    {!collapsed && (
                       <span className="text-white/90 font-medium truncate text-[15px] leading-5 transition-colors duration-300">
                         {item.title}
                       </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        
        {/* Enhanced User Profile - Responsive to collapse state */}
        <div className={`mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed ? (
            // Full Profile View
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-white/30 shadow-lg">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary-foreground to-primary text-white font-bold text-sm">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">John Doe</p>
                <p className="text-xs text-white/70 truncate">john@company.com</p>
              </div>
            </div>
          ) : (
            // Collapsed Profile View - Avatar Only
            <div className="flex justify-center">
              <Avatar className="w-8 h-8 ring-2 ring-white/30 shadow-lg">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary-foreground to-primary text-white font-bold text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}