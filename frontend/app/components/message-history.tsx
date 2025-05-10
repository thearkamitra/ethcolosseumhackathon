import { ThumbsDown, ThumbsUp, RefreshCw, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function MessageHistory() {
  const conversations = [
    {
      id: 1,
      time: "11:42 PM",
      customer: "Policy #28491",
      messages: [
        { role: "user", content: "I need to add my new car to my auto insurance policy. Can I do that now?" },
        {
          role: "assistant",
          content:
            "I'd be happy to help you add a vehicle to your policy. I'll need some information about the car. Could you please provide the year, make, model, and VIN number of the vehicle you'd like to add?",
        },
        { role: "user", content: "It's a 2023 Toyota Camry, VIN is 4T1BF1FK5NU123456." },
        {
          role: "assistant",
          content:
            "Thank you for providing those details. I've added the 2023 Toyota Camry to your policy. The updated coverage will be effective immediately. Your new premium will be $142.50 per month, an increase of $28.75 from your current rate. You'll receive the updated policy documents by email within the next hour. Is there anything else you need help with regarding your policy?",
        },
      ],
    },
    {
      id: 2,
      time: "1:15 AM",
      customer: "Policy #37219",
      messages: [
        { role: "user", content: "How do I file a claim for water damage in my basement?" },
        {
          role: "assistant",
          content:
            "I'm sorry to hear about the water damage in your basement. To file a claim, you'll need to provide details about the incident, including the date of occurrence, cause of damage (if known), and photos of the affected area. Your homeowner's policy (#HO-37219) includes water damage coverage with a $500 deductible. Would you like to start the claims process now, or would you prefer to have a claims adjuster call you in the morning?",
        },
      ],
    },
    {
      id: 3,
      time: "3:27 AM",
      customer: "Policy #14672",
      messages: [
        {
          role: "user",
          content: "I was in a car accident tonight. The other driver hit my parked car. What should I do?",
        },
        {
          role: "assistant",
          content:
            "I'm very sorry to hear about your accident. Your safety is our first priority. If you haven't already, please ensure you're in a safe location and contact the police to file a report. For your auto policy (#AU-14672), you have collision coverage with a $250 deductible. To start the claims process, we'll need: 1) The police report number, 2) Photos of the damage, 3) The other driver's insurance information if available. Would you like me to initiate an emergency claim that will be prioritized by our claims department first thing in the morning? I can also arrange for a towing service if your vehicle isn't drivable.",
        },
      ],
      flagged: true,
    },
  ]

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Policy Inquiries & Claims</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort: Newest First
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className={conversation.flagged ? "border-amber-300" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">{conversation.customer}</CardTitle>
                  {conversation.flagged && (
                    <Badge variant="outline" className="text-amber-500 border-amber-300">
                      <Flag className="h-3 w-3 mr-1" /> Urgent Claim
                    </Badge>
                  )}
                </div>
                <CardDescription>{conversation.time}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {conversation.messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
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
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4 mr-1" /> Escalate to Agent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
