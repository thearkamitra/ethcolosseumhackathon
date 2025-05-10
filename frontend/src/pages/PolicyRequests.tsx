
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckSquare, Download, ThumbsUp, ThumbsDown, RefreshCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Define the proper type for PolicyRequest
type PolicyStatus = "Pending" | "Good" | "Needs Improvement";

interface PolicyRequest {
  id: string;
  time: string;
  policyNumber: string;
  snippet: string;
  status: PolicyStatus;
}

// Sample data
const initialRequests: PolicyRequest[] = Array(10).fill(null).map((_, i) => ({
  id: `req-${i+1}`,
  time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
  policyNumber: `POL-${100000 + i}`,
  snippet: [
    "I need to understand my coverage limits for water damage.",
    "When does my home insurance policy renew?",
    "How can I add my spouse to my auto insurance?",
    "What documents do I need to submit for a claim?",
    "Is rental car coverage included in my policy?",
  ][Math.floor(Math.random() * 5)],
  status: "Pending"
}));

export default function PolicyRequests() {
  const [requests, setRequests] = useState<PolicyRequest[]>(initialRequests);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const handleStatusUpdate = (id: string, newStatus: PolicyStatus) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
    
    toast("Status updated", {
      description: `Request marked as ${newStatus}`
    });
  };
  
  const handleEscalate = (id: string) => {
    // We handle escalation separately since it's not part of the PolicyStatus type
    toast("Request escalated", {
      description: "This request has been escalated to an agent."
    });
    
    // Remove the escalated request from the list
    setRequests(prev => prev.filter(req => req.id !== id));
  };
  
  const handleRegenerate = (id: string) => {
    toast("Regenerating response", {
      description: "A new response is being generated."
    });
    
    // For demo purposes, we just reset the status to pending
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: "Pending" } : req
      )
    );
  };
  
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };
  
  const handleExport = () => {
    if (selectedIds.length === 0) {
      toast("No items selected", {
        description: "Please select at least one request to export."
      });
      return;
    }
    
    toast("Exporting selected items", {
      description: `${selectedIds.length} items will be exported as CSV.`
    });
    
    // Reset selection after export
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Requests</h1>
          <p className="text-muted-foreground mt-1.5">Review and manage policy inquiries</p>
        </div>
        
        <Button 
          onClick={handleExport}
          disabled={selectedIds.length === 0} 
          className="flex items-center gap-2 self-start"
        >
          <Download className="h-4 w-4" />
          Export {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead className="w-32">Time</TableHead>
              <TableHead className="w-40">Policy #</TableHead>
              <TableHead>Query</TableHead>
              <TableHead className="w-48 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(request.id)}
                      onChange={() => handleToggleSelect(request.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{request.time}</TableCell>
                <TableCell>{request.policyNumber}</TableCell>
                <TableCell className="max-w-md truncate">{request.snippet}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleStatusUpdate(request.id, "Good")} 
                    className="h-8 w-8 text-green-600"
                    disabled={request.status === "Good"}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleStatusUpdate(request.id, "Needs Improvement")} 
                    className="h-8 w-8 text-amber-600"
                    disabled={request.status === "Needs Improvement"}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRegenerate(request.id)} 
                    className="h-8 w-8 text-blue-600"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEscalate(request.id)} 
                    className="h-8 w-8 text-red-600"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No policy requests to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
