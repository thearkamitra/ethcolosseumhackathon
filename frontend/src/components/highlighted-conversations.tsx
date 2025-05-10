
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, Eye, BookmarkPlus } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  time: string;
  description: string;
  type: "Urgent" | "VIP" | "Review";
}

const conversations: Conversation[] = [
  {
    id: "1",
    title: "Urgent auto claim after highway accident",
    time: "2:15 AM",
    description: "Customer reported multi-vehicle accident requiring immediate assistance and towing",
    type: "Urgent"
  },
  {
    id: "2",
    title: "VIP client requesting policy amendment",
    time: "3:42 AM",
    description: "Platinum member requesting coverage addition for newly purchased vacation property",
    type: "VIP"
  },
  {
    id: "3",
    title: "Potential fraud alert on claim submission",
    time: "1:07 AM",
    description: "System flagged unusual pattern in documentation provided for water damage claim",
    type: "Review"
  }
];

export function HighlightedConversations() {
  const handleViewConversation = (id: string) => {
    toast.info("Opening conversation", {
      description: `Viewing full conversation #${id}`
    });
  };

  const handleMarkForFollowup = (id: string) => {
    toast.success("Marked for follow-up", {
      description: `Conversation #${id} has been marked for agent follow-up`
    });
  };

  const handleEscalateToAgent = (id: string) => {
    toast.info("Escalated to agent", {
      description: `Conversation #${id} has been escalated to the next available agent`
    });
  };

  const getTypeStyles = (type: Conversation["type"]) => {
    switch (type) {
      case "Urgent": 
        return "bg-red-100 text-red-800";
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "Review":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Highlighted Conversations</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => toast.info("View all conversations")}
        >
          View all
        </Button>
      </div>
      
      <div className="space-y-4">
        {conversations.map(conversation => (
          <Card key={conversation.id} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{conversation.title}</h3>
                    <Badge className={`${getTypeStyles(conversation.type)}`}>{conversation.type}</Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {conversation.time}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{conversation.description}</p>
              </div>
              
              <div className="flex border-t bg-slate-50/50">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none text-xs h-9 border-r" 
                  onClick={() => handleViewConversation(conversation.id)}
                >
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  View Full Conversation
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none text-xs h-9 border-r" 
                  onClick={() => handleMarkForFollowup(conversation.id)}
                >
                  <BookmarkPlus className="h-3.5 w-3.5 mr-2" />
                  Mark for Follow-up
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none text-xs h-9 text-primary hover:text-primary" 
                  onClick={() => handleEscalateToAgent(conversation.id)}
                >
                  Escalate to Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
