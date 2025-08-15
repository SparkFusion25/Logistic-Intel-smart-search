import { 
  LayoutDashboard, Search, Contact, Mail, BarChart3, Flag, LineChart, 
  Clock8, Boxes, FileText, Calculator, Activity, ShieldCheck, Settings, HelpCircle, BookOpen 
} from "lucide-react"
import { NavLink } from "react-router-dom"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "CRM", url: "/dashboard/crm", icon: Contact },
  { title: "Email", url: "/dashboard/email", icon: Mail },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Campaigns", url: "/dashboard/campaigns", icon: Flag },
  { title: "Campaign Analytics", url: "/dashboard/campaigns/analytics", icon: LineChart },
  { title: "Follow‑Ups", url: "/dashboard/campaigns/follow-ups", icon: Clock8 },
  { title: "Widgets", url: "/dashboard/widgets", icon: Boxes },
  { title: "Quote Generator", url: "/dashboard/widgets/quote", icon: FileText },
  { title: "Tariff Calculator", url: "/dashboard/widgets/tariff", icon: Calculator },
  { title: "Benchmark", url: "/dashboard/widgets/benchmark", icon: Activity },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
]

const bottomItems = [
  { title: "Blog", url: "/blog", icon: BookOpen },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar
      side="left"
      variant="sidebar" 
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">LogisticIntel</h2>
              <p className="text-xs text-sidebar-foreground/60">Trade Intelligence</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={collapsed ? item.title : undefined}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-sidebar-accent/10"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                tooltip={collapsed ? item.title : undefined}
                className="hover:bg-sidebar-accent/10"
              >
                <NavLink to={item.url}>
                  <item.icon className="w-4 h-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {!collapsed && (
          <div className="mt-4 p-3 bg-sidebar-accent/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">john@company.com</p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}