"use client";

import { ThumbsDown, ThumbsUp, RefreshCw, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import ChatInput from "./chat-input"
import { useChat } from "@/lib/chat-context"
import { useEffect } from "react"

export default function MessageHistory() {
  const { conversations, flagConversation, unflagConversation, startNewConversation } = useChat();
  
  // Create a default conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      startNewConversation("New Policy");
    }
  }, [conversations.length, startNewConversation]);
  
  // Format the timestamp to a readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleFlag = (conversationId: string, isFlagged: boolean | undefined) => {
    if (isFlagged) {
      unflagConversation(conversationId);
    } else {
      flagConversation(conversationId);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Policy Inquiries & Claims</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => startNewConversation("New Policy")}
          >
            New Conversation
          </Button>
          <Button variant="outline" size="sm">
            Sort: Newest First
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {conversations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No conversations yet. Start a new conversation.</p>
              <Button className="mt-4" variant="default" onClick={() => {
                startNewConversation("New Policy");
              }}>
                Start New Conversation
              </Button>
            </CardContent>
          </Card>
        ) : (
          conversations.map((conversation) => (
            <Card key={conversation.id} className={conversation.flagged ? "border-amber-300" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">Policy #{conversation.policyNumber}</CardTitle>
                    {conversation.flagged && (
                      <Badge variant="outline" className="text-amber-500 border-amber-300">
                        <Flag className="h-3 w-3 mr-1" /> Urgent Claim
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{formatTime(conversation.timestamp)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    {conversation.messages.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-8">
                        No messages yet. Type a message below to start the conversation.
                      </div>
                    ) : (
                      conversation.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" /> Good
                    </Button>
                    <Button variant="outline" size="sm">
                      <ThumbsDown className="h-4 w-4 mr-1" /> Needs Improvement
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFlag(conversation.id, conversation.flagged)}
                    >
                      <Flag className="h-4 w-4 mr-1" /> 
                      {conversation.flagged ? "Remove Flag" : "Flag as Urgent"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <ChatInput />
    </div>
  );
}
