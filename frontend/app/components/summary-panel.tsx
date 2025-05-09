import { Copy, Download, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function SummaryPanel() {
  const summaryPoints = [
    "Handled 142 customer inquiries about policy coverage and premium details",
    "Scheduled 18 follow-up calls with licensed insurance agents",
    "Processed 7 urgent claim status inquiries with appropriate escalation",
    "Answered 35 FAQs about policy renewals and coverage changes",
    "Provided policy recommendations to 28 potential customers based on their needs",
  ]

  const highlightedConversations = [
    {
      id: 1,
      title: "Urgent auto claim after highway accident",
      preview: "Customer reported multi-vehicle accident requiring immediate assistance and towing",
      priority: "high",
      time: "2:15 AM",
    },
    {
      id: 2,
      title: "VIP client requesting policy amendment",
      preview: "Client needs to add new property to existing homeowner's policy before closing tomorrow",
      priority: "high",
      time: "3:42 AM",
    },
    {
      id: 3,
      title: "Potential fraud alert on claim submission",
      preview: "Unusual claim pattern detected, similar to recent fraud cases",
      priority: "medium",
      time: "1:07 AM",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Overnight Summary</CardTitle>
            <CardDescription>Activity summary for May 8, 2025, 8:00 PM - 6:00 AM</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Key Activities</h3>
            <ul className="mt-2 space-y-2">
              {summaryPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Performance Insights</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Similar Claim Resolution</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Efficient
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  27 inquiries were identified as similar to previous claims, allowing for faster resolution using
                  established claim processing protocols.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Incomplete Form Analysis</h4>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    Improving
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  8 incomplete claim forms detected (5.6% of total). Most common issue: missing documentation for
                  property damage (62%).
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium">Highlighted Conversations</h3>
            <div className="space-y-3">
              {highlightedConversations.map((conversation) => (
                <Collapsible key={conversation.id} className="border rounded-md">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-2">
                      <Flag
                        className={`h-4 w-4 ${conversation.priority === "high" ? "text-red-500" : "text-amber-500"}`}
                      />
                      <span className="font-medium">{conversation.title}</span>
                      <Badge variant={conversation.priority === "high" ? "destructive" : "outline"}>
                        {conversation.priority === "high" ? "Urgent" : "Review"}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{conversation.time}</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-4">
                      <p className="text-sm text-muted-foreground mb-3">{conversation.preview}</p>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View Full Conversation
                        </Button>
                        <Button size="sm">Mark for Follow-up</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
