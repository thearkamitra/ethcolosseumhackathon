
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileDown, RefreshCcw, Menu } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const { toggleSidebar } = useSidebar();
  
  const handleExport = () => {
    toast.success("Exporting PDF", {
      description: "Your report is being generated and will download shortly."
    });

    // Simulate PDF generation delay
    setTimeout(() => {
      toast.success("Export complete", {
        description: "Your PDF report has been downloaded."
      });
    }, 1500);
  };
  
  const handleRefresh = () => {
    setLastSynced(new Date());
    toast("Data refreshed", {
      description: "Latest data has been loaded"
    });
  };
  
  const timeString = lastSynced.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRefresh} className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCcw className="h-3.5 w-3.5" />
          <span>Last synced:</span> 
          <span className="font-medium text-foreground">{timeString}</span>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        
        <Button size="sm" onClick={handleExport} className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90">
          <FileDown className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
        <Button size="icon" onClick={handleExport} className="md:hidden bg-primary hover:bg-primary/90">
          <FileDown className="h-4 w-4" />
        </Button>
        <UserDropdown />
      </div>
    </header>;
}

function UserDropdown() {
  const handleProfileAction = (action: string) => {
    toast(action, {
      description: `You clicked on ${action}`
    });
  };
  
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleProfileAction("Profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileAction("Settings")}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileAction("Help & Support")}>Help & Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleProfileAction("Log out")}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
}
