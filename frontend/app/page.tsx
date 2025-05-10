import { Clock, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityMetrics from "./components/activity-metrics"
import SummaryPanel from "./components/summary-panel"
import MessageHistory from "./components/message-history"
import SettingsPanel from "./components/settings-panel"
import StatisticsPanel from "./components/statistics-panel"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-2xl font-semibold">ConversAIge – Your After-Hours Insurance Concierge</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: Today, 6:00 AM</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <Tabs defaultValue="dashboard">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="messages">Policy Inquiries</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
              </div>
            </div>
            <TabsContent value="dashboard" className="space-y-6 pt-4">
              <ActivityMetrics />
              <StatisticsPanel />
              <SummaryPanel />
            </TabsContent>
            <TabsContent value="messages">
              <MessageHistory />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
