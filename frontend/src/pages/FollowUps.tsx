import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Check, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function FollowUps() {
  const [callbackList, setCallbackList] = useState(callbacks);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const markAsComplete = (id: string) => {
    setCallbackList(prev =>
      prev.map(callback =>
        callback.id === id
          ? { ...callback, completed: !callback.completed }
          : callback
      )
    );
    
    const callback = callbackList.find(c => c.id === id);
    
    toast({
      title: callback?.completed ? "Callback marked as incomplete" : "Callback marked as complete",
      description: `Customer: ${callback?.customerName}`,
    });
  };
  
  const handleScheduleCallback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const customerName = formData.get("customerName") as string;
    const reason = formData.get("reason") as string;
    
    if (!customerName || !reason || !date) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    const newCallback = {
      id: Math.random().toString(36).substring(7),
      customerName,
      reason,
      dateTime: format(date, "PPpp"),
      completed: false,
      source: 'Human' as const // Fix: explicitly type as 'Human' with const assertion
    };
    
    setCallbackList(prev => [...prev, newCallback]);
    
    toast({
      title: "Callback scheduled",
      description: `For ${customerName} on ${format(date, "PPpp")}`,
    });
    
    // Reset form
    e.currentTarget.reset();
  };

  // Function to get badge color based on source
  const getSourceBadgeClass = (source: 'AI' | 'Human') => {
    return source === 'AI' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };
  
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Follow-Ups</h1>
          <p className="text-muted-foreground">Manage escalated calls that require additional agent action</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Schedule New Follow-Up
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a Follow-Up</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleScheduleCallback}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="customerName" className="text-sm font-medium">
                    Customer Name
                  </label>
                  <Input
                    id="customerName"
                    name="customerName"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Date and Time
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPp") : "Select date and time"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Reason for Follow-Up
                  </label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Explain why this escalated call requires follow-up"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Schedule Follow-Up</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle>Scheduled Follow-Ups</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop view */}
          <div className="hidden sm:block sm-scroll-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callbackList.length > 0 ? (
                  callbackList.map((callback) => (
                    <TableRow key={callback.id}>
                      <TableCell className="font-medium">{callback.dateTime}</TableCell>
                      <TableCell>{callback.customerName}</TableCell>
                      <TableCell>{callback.reason}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSourceBadgeClass(callback.source)}`}>
                          {callback.source}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Checkbox
                            checked={callback.completed}
                            onCheckedChange={() => markAsComplete(callback.id)}
                            className="mr-2"
                          />
                          <span>{callback.completed ? "Completed" : "Pending"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={callback.completed ? "outline" : "default"}
                          size="sm"
                          onClick={() => markAsComplete(callback.id)}
                        >
                          {callback.completed ? "Undo" : (
                            <>
                              <Check className="mr-1 h-4 w-4" />
                              Mark Done
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No follow-ups scheduled
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile view */}
          <div className="block sm:hidden">
            {callbackList.length > 0 ? (
              <div className="space-y-4">
                {callbackList.map((callback) => (
                  <Card key={callback.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{callback.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{callback.dateTime}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSourceBadgeClass(callback.source)}`}>
                          {callback.source}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-4 line-clamp-2">{callback.reason}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Checkbox
                            checked={callback.completed}
                            onCheckedChange={() => markAsComplete(callback.id)}
                            className="mr-2"
                          />
                          <span className="text-sm">{callback.completed ? "Completed" : "Pending"}</span>
                        </div>
                        
                        <Button
                          variant={callback.completed ? "outline" : "default"}
                          size="sm"
                          onClick={() => markAsComplete(callback.id)}
                          className="w-24"
                        >
                          {callback.completed ? "Undo" : "Mark Done"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No follow-ups scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Fixed callbacks import 
import { callbacks } from "@/lib/mock-data";
