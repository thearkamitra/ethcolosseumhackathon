
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  BarChart2, 
  MessageSquare,
  Clock,
  Settings,
  MessageCircle,
  ChevronLeft,
  Menu
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Updated menu items
const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    url: "/",
  },
  {
    title: "Live Calls",
    icon: MessageSquare,
    url: "/live-calls",
  },
  {
    title: "Follow-Ups",
    icon: Clock,
    url: "/follow-ups",
  },
  {
    title: "Talk with AI",
    icon: MessageCircle,
    url: "/talk-with-ai",
  },
  {
    title: "Customization",
    icon: Settings,
    url: "/bot-settings",
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { state, setOpenMobile, openMobile } = useSidebar();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log("Sidebar state:", state, "isMobile:", isMobile, "openMobile:", openMobile);
    
    // Close mobile sidebar when route changes
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [state, location.pathname, isMobile, setOpenMobile]);
  
  return (
    <Sidebar className="border-r">
      <div className="flex h-16 items-center justify-between px-4 border-b bg-sidebar-background">
        <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
          <span className="text-sidebar-primary-foreground bg-sidebar-primary p-1.5 rounded">Blink</span>
          <span className={cn(state === "collapsed" ? "hidden" : "hidden sm:inline")}>AI</span>
        </h1>
        <SidebarTrigger className="flex text-sidebar-foreground">
          {state === "collapsed" ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </SidebarTrigger>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md text-sidebar-foreground",
                        location.pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className={cn("font-medium", state === "collapsed" ? "hidden" : "block")}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="text-sidebar-foreground text-xs">
          <p className={cn("mb-1 font-medium", state === "collapsed" ? "hidden" : "block")}>BlinkAI Dashboard</p>
          <p className={cn("opacity-70", state === "collapsed" ? "hidden" : "block")}>v1.2.0</p>
        </div>
      </div>
    </Sidebar>
  );
}
