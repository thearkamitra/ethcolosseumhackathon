
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash, Edit, Save } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
}

const defaultFAQs = [
  {
    id: "1",
    question: "How long does it take to process a claim?",
    answer: "Standard claims are typically processed within 3-5 business days. For expedited processing, please mark your claim as urgent."
  },
  {
    id: "2",
    question: "Can I change my policy online?",
    answer: "Yes, you can make most policy changes through our online portal. For complex changes, the system will direct you to speak with an agent."
  },
  {
    id: "3",
    question: "What languages does the AI assistant support?",
    answer: "Our AI assistant currently supports English, French, German, Italian, Spanish, Portuguese, Dutch, and Polish."
  }
];

export default function BotSettings() {
  const [settings, setSettings] = useState({
    enableVoiceSupport: true,
    enableMultilingualSupport: true,
    feedbackCollection: true,
    autoEscalation: true,
  });
  
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast.success("Setting updated", {
      description: `${setting} has been ${!settings[setting] ? "enabled" : "disabled"}`
    });
  };
  
  const handleAddFAQ = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    
    if (!question || !answer) {
      toast.error("Missing information", {
        description: "Both question and answer are required"
      });
      return;
    }
    
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question,
      answer
    };
    
    setFaqs(prev => [...prev, newFAQ]);
    setIsAddingFAQ(false);
    
    toast.success("FAQ added", {
      description: "Your new FAQ has been added to the knowledge base"
    });
  };
  
  const handleUpdateFAQ = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editingFAQ) return;
    
    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    
    if (!question || !answer) {
      toast.error("Missing information", {
        description: "Both question and answer are required"
      });
      return;
    }
    
    setFaqs(prev => prev.map(faq => 
      faq.id === editingFAQ.id ? { ...faq, question, answer } : faq
    ));
    
    setEditingFAQ(null);
    
    toast.success("FAQ updated", {
      description: "Your FAQ has been updated successfully"
    });
  };
  
  const handleDeleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    
    toast.success("FAQ deleted", {
      description: "The FAQ has been removed from the knowledge base"
    });
  };
  
  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customization</h1>
        <p className="text-muted-foreground mt-1.5">Configure your AI assistant's behavior and knowledge</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Manage your AI assistant's knowledge base</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddingFAQ(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Question</TableHead>
                  <TableHead className="w-[50%]">Answer</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="align-top font-medium">{faq.question}</TableCell>
                    <TableCell className="align-top">{faq.answer}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditFAQ(faq)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFAQ(faq.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {faqs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No FAQs added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Settings</CardTitle>
            <CardDescription>Configure how your AI assistant behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice Support</p>
                <p className="text-sm text-muted-foreground">Enable voice input and output</p>
              </div>
              <Switch 
                checked={settings.enableVoiceSupport} 
                onCheckedChange={() => handleToggle('enableVoiceSupport')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Multilingual Support</p>
                <p className="text-sm text-muted-foreground">Detect and respond in multiple languages</p>
              </div>
              <Switch 
                checked={settings.enableMultilingualSupport} 
                onCheckedChange={() => handleToggle('enableMultilingualSupport')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Feedback Collection</p>
                <p className="text-sm text-muted-foreground">Ask for feedback after conversations</p>
              </div>
              <Switch 
                checked={settings.feedbackCollection} 
                onCheckedChange={() => handleToggle('feedbackCollection')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Escalation</p>
                <p className="text-sm text-muted-foreground">Automatically escalate complex issues</p>
              </div>
              <Switch 
                checked={settings.autoEscalation} 
                onCheckedChange={() => handleToggle('autoEscalation')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add FAQ Dialog */}
      <Dialog open={isAddingFAQ} onOpenChange={setIsAddingFAQ}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddFAQ}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="question" className="text-sm font-medium">
                  Question
                </label>
                <Input
                  id="question"
                  name="question"
                  placeholder="Enter the frequently asked question"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="answer" className="text-sm font-medium">
                  Answer
                </label>
                <Textarea
                  id="answer"
                  name="answer"
                  placeholder="Enter the answer to the question"
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save FAQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit FAQ Dialog */}
      <Dialog open={!!editingFAQ} onOpenChange={(open) => !open && setEditingFAQ(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          {editingFAQ && (
            <form onSubmit={handleUpdateFAQ}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-question" className="text-sm font-medium">
                    Question
                  </label>
                  <Input
                    id="edit-question"
                    name="question"
                    defaultValue={editingFAQ.question}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="edit-answer" className="text-sm font-medium">
                    Answer
                  </label>
                  <Textarea
                    id="edit-answer"
                    name="answer"
                    defaultValue={editingFAQ.answer}
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingFAQ(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Update FAQ
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
