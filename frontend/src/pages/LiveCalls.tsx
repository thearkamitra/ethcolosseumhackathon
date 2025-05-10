
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Play, Volume2, Pause, VolumeX, Clock, User } from "lucide-react";
import { faker } from "@faker-js/faker";
import { type LiveCall } from "@/lib/mock-data"; 

// Sample realistic conversation snippets
const realSnippets = [
  "I'm looking to file a claim for water damage in my kitchen from a leak last week.",
  "My deductible seems higher than what I initially agreed to in my policy documents.",
  "I need to add my new vehicle to my auto insurance policy effective immediately.",
  "We've moved to a new address and I need to update our homeowners insurance information.",
  "I don't understand why my claim was denied. The damage should be covered under my policy.",
  "Can you explain the liability coverage limits on my current auto insurance policy?",
  "I want to dispute a charge on my last premium payment that looks incorrect.",
  "I need to file a claim for a car accident that happened yesterday on Main Street.",
  "How do I add my teenage daughter as a driver to our auto insurance policy?"
];

// Generate truly chronological calls with proper timestamps
const generateRealisticCalls = (count: number): LiveCall[] => {
  // Generate the current time
  const now = new Date();
  
  return Array.from({ length: count }).map((_, index) => {
    const languages = ['EN', 'DE', 'FR', 'IT'] as const;
    const intents = ['Claims', 'Billing', 'Policy'] as const;
    
    // Create chronological timestamps - newer calls have more recent times
    // The newest call (index 0) gets the current time
    // Each subsequent call is 1-3 minutes older
    const minutesAgo = index * (faker.number.int({ min: 1, max: 3 }));
    const callTime = new Date(now.getTime() - minutesAgo * 60000);
    
    return {
      id: faker.string.uuid(),
      timestamp: callTime.toLocaleTimeString(), 
      language: languages[faker.number.int({ min: 0, max: languages.length - 1 })],
      intent: intents[faker.number.int({ min: 0, max: intents.length - 1 })],
      snippet: realSnippets[faker.number.int({ min: 0, max: realSnippets.length - 1 })],
      isUrgent: faker.datatype.boolean(0.2),
      customerName: faker.person.fullName(),
    };
  });
};

export default function LiveCalls() {
  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<LiveCall | null>(null);
  const [isPlaybackModalOpen, setIsPlaybackModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);
  
  // Initialize with initial calls
  useEffect(() => {
    console.log("Initializing live calls with chronological timestamps");
    const initialCalls = generateRealisticCalls(5);
    setCalls(initialCalls);
    setTotalCalls(initialCalls.length);
  }, []);
  
  // Simulate new calls coming in - every 5 seconds
  useEffect(() => {
    console.log("Setting up interval for new calls - current count:", totalCalls);
    
    const interval = setInterval(() => {
      // New call every 5 seconds, up to 20 total calls
      if (totalCalls < 20) {
        // Generate a single new call that happened right now
        const newCall = generateRealisticCalls(1)[0];
        // Force the timestamp to be the current time
        newCall.timestamp = new Date().toLocaleTimeString();
        
        console.log("Adding new call with current timestamp:", newCall.timestamp);
        
        // Add the new call to the beginning of the list (most recent first)
        setCalls(prev => [newCall, ...prev]);
        
        setTotalCalls(prev => prev + 1);
        
        toast.info(`New call received`, {
          description: `${newCall.customerName} - ${newCall.intent}`
        });
      } else {
        // Once we reach 20 calls, clear the interval
        console.log("Reached 20 calls, clearing interval");
        clearInterval(interval);
      }
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [totalCalls]);
  
  const handleViewCall = (call: LiveCall) => {
    setSelectedCall(call);
    setIsPlaybackModalOpen(true);
    setCurrentTime(0);
    setIsPlaying(false);
  };
  
  const handleArchiveCall = (id: string) => {
    const call = calls.find(c => c.id === id);
    if (!call) return;
    
    setCalls(prev => prev.filter(c => c.id !== id));
    
    toast.success("Call archived", {
      description: `${call.customerName}'s call has been archived`
    });
  };
  
  // Controls for the audio player
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Simulate progress
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 300);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentTime(100);
      }, 30000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Calls</h1>
        <p className="text-muted-foreground mt-1.5">Monitor and manage incoming customer calls</p>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Calls ({calls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="sm-scroll-container">
            {/* Desktop view - table will scroll horizontally on small screens */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.length > 0 ? (
                    calls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="flex items-center gap-2">
                          {call.isUrgent && (
                            <Badge variant="destructive" className="h-1.5 w-1.5 rounded-full p-0" />
                          )}
                          {call.timestamp}
                        </TableCell>
                        <TableCell>{call.customerName}</TableCell>
                        <TableCell>{call.language}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {call.intent}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {call.snippet}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewCall(call)}
                            >
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Play
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleArchiveCall(call.id)}
                            >
                              Archive
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No calls at the moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile view - card-based layout */}
            <div className="block sm:hidden">
              {calls.length > 0 ? (
                <div className="space-y-4">
                  {calls.map((call) => (
                    <Card key={call.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {call.isUrgent && (
                              <Badge variant="destructive" className="h-1.5 w-1.5 rounded-full p-0" />
                            )}
                            <span className="font-medium text-sm">{call.timestamp}</span>
                          </div>
                          <Badge variant="outline" className="font-normal">
                            {call.intent}
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium">{call.customerName}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{call.snippet}</p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="font-normal">
                            {call.language}
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewCall(call)}
                            >
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Play
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleArchiveCall(call.id)}
                            >
                              Archive
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No calls at the moment
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isPlaybackModalOpen} onOpenChange={setIsPlaybackModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Call Playback</DialogTitle>
            <DialogDescription>
              {selectedCall && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{selectedCall.customerName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedCall.timestamp}</span>
                    <Badge className="ml-2">{selectedCall.language}</Badge>
                    <Badge variant="outline">{selectedCall.intent}</Badge>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-slate-50">
            <div className="text-sm">
              {selectedCall?.snippet}
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300" 
                  style={{ width: `${currentTime}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {Math.floor(currentTime * 0.3)}s
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0" 
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0" 
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setIsPlaybackModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
