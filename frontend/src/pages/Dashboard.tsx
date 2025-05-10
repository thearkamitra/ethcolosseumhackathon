
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { TrendChart } from "@/components/trend-chart";
import { chartData, kpiMetrics, callbacks } from "@/lib/mock-data";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [callbackList, setCallbackList] = useState(callbacks.slice(0, 3));
  const navigate = useNavigate();
  
  // Filter out the "Top Questions" metric
  const filteredMetrics = kpiMetrics.filter(metric => metric.title !== "Top Questions");
  
  const handleViewAllFollowUps = () => {
    navigate("/follow-ups");
  };
  
  const markAsComplete = (id: string) => {
    setCallbackList(prev =>
      prev.map(callback =>
        callback.id === id
          ? { ...callback, completed: !callback.completed }
          : callback
      )
    );
    
    const callback = callbackList.find(c => c.id === id);
    
    toast.success(callback?.completed ? "Callback marked as incomplete" : "Callback marked as complete", {
      description: `Customer: ${callback?.customerName}`
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="heading-responsive font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Overview of your AI assistant performance</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {filteredMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
          />
        ))}
      </div>
      
      <div className="grid gap-3 md:gap-5">
        <div>
          <TrendChart 
            key={refreshKey}
            data={chartData} 
            title="7-Day Performance Trend" 
            description="Percentage of calls handled by AI vs escalated to agents" 
          />
        </div>
        
        <div>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Agent Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Average wait time</span>
                  <span className="font-medium">42 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">AI response time</span>
                  <span className="font-medium text-primary">8 sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Cost per inquiry</span>
                  <span className="font-medium">$0.12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Customer satisfaction</span>
                  <span className="font-medium">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle>Recent Follow-Ups</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewAllFollowUps}
              className="text-xs w-full sm:w-auto"
            >
              Show all follow-ups
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] sm:w-auto">Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px] sm:w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callbackList.length > 0 ? (
                  callbackList.map((callback) => (
                    <TableRow key={callback.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{callback.dateTime}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{callback.customerName}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{callback.reason}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Checkbox
                            checked={callback.completed}
                            onCheckedChange={() => markAsComplete(callback.id)}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm">{callback.completed ? "Completed" : "Pending"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={callback.completed ? "outline" : "default"}
                          size="sm"
                          onClick={() => markAsComplete(callback.id)}
                          className="text-xs w-full sm:w-auto"
                        >
                          {callback.completed ? "Undo" : "Done"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No callbacks scheduled
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
