
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Mic, MicOff, Settings } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I assist you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
  }
];

export default function TalkWithAI() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPulse, setRecordingPulse] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Animation for recording button
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingPulse(prev => (prev + 1) % 3);
      }, 500);
    } else {
      setRecordingPulse(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue.trim()),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleRecording = () => {
    if (!isRecording) {
      toast.info("Voice input started", {
        description: "Listening for your question..."
      });
      setIsRecording(true);
      
      // Simulate voice recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("Could you explain how automatic claim processing works?");
        toast.info("Voice input received", {
          description: "Voice input has been transcribed"
        });
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info("Voice input cancelled");
    }
  };
  
  // Simple response generator
  const getAIResponse = (input: string) => {
    const responses = [
      "I understand your question about insurance claims. Our system processes standard claims within 24-48 hours.",
      "That's a great question. Our AI can handle inquiries in 8 different languages including French, German and Spanish.",
      "Most policy updates are processed immediately and become effective at midnight. Would you like me to make this change now?",
      "Based on your coverage plan, this type of claim should be fully covered. Would you like me to initiate the process?",
      "I'm checking your account history now. I can see that your previous inquiry was resolved on the 15th of this month.",
      "For this particular situation, I'd recommend filing under your comprehensive coverage rather than liability."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talk with AI</h1>
        <p className="text-muted-foreground mt-1.5">Have a voice conversation with your AI assistant</p>
      </div>
      
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <CardTitle>AI Conversation</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => toast.info("Settings opened")}>
              <Settings className="h-4 w-4 mr-2" /> 
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant={isRecording ? "destructive" : "outline"} 
                  size="icon" 
                  onClick={toggleRecording}
                  className={`rounded-full transition-all duration-300 ${
                    isRecording ? 
                    `animate-pulse shadow-lg shadow-primary/30 ${
                      recordingPulse === 0 ? 'scale-100' : 
                      recordingPulse === 1 ? 'scale-110' : 'scale-105'
                    }` : ''
                  }`}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message or click the microphone to speak..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
