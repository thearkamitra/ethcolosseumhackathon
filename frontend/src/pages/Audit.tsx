
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { auditLogs, AuditLog } from "@/lib/mock-data";
import { 
  CalendarIcon, 
  Download, 
  Eye, 
  EyeOff, 
  Filter, 
  MessageSquare, 
  PhoneForwarded, 
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Audit() {
  const [showRedacted, setShowRedacted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const getFilteredLogs = () => {
    let filtered = [...auditLogs];
    
    // Filter by date
    if (date) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });
    }
    
    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(log => log.type === selectedType);
    }
    
    return filtered;
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Query":
        return <MessageSquare className="h-4 w-4" />;
      case "Escalation":
        return <PhoneForwarded className="h-4 w-4" />;
      case "Callback":
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const filteredLogs = getFilteredLogs();
  
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit & Privacy</h1>
          <p className="text-muted-foreground">Review call logs and data compliance</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Audit Log
        </Button>
      </div>
      
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Interaction Timeline</CardTitle>
              <CardDescription>
                All system interactions, redacted for privacy
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select
                defaultValue="all"
                onValueChange={setSelectedType}
              >
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Query">Queries</SelectItem>
                  <SelectItem value="Escalation">Escalations</SelectItem>
                  <SelectItem value="Callback">Callbacks</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowRedacted(!showRedacted)}
                >
                  {showRedacted ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {filteredLogs.length > 0 ? (
              <div className="relative pl-6 border-l">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="mb-6 relative">
                    <div 
                      className={cn(
                        "absolute -left-[31px] p-2 rounded-full",
                        log.type === "Query" ? "bg-blue-100" : "",
                        log.type === "Escalation" ? "bg-red-100" : "",
                        log.type === "Callback" ? "bg-green-100" : "",
                      )}
                    >
                      {getTypeIcon(log.type)}
                    </div>
                    <div className="bg-card border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium">{log.type}</p>
                          <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                        </div>
                        <Badge type={log.type} />
                      </div>
                      <p className="text-sm">
                        {log.redacted && !showRedacted ? (
                          <span className="bg-gray-200 px-2 rounded text-transparent select-none">
                            Redacted content for privacy
                          </span>
                        ) : (
                          log.content
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs found for the selected filters
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Call Recording Consent</p>
                <p className="text-sm text-muted-foreground">
                  Enable call recording for training purposes
                </p>
              </div>
              <Switch defaultChecked id="record-consent" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    'Query': 'bg-blue-100 text-blue-800',
    'Escalation': 'bg-red-100 text-red-800',
    'Callback': 'bg-green-100 text-green-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[type]}`}>
      {type}
    </span>
  );
}
