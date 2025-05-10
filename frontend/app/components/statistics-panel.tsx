import { BarChart3, PieChart, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StatisticsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Insurance Analytics</CardTitle>
            <CardDescription>Analysis of similar claims and incomplete forms</CardDescription>
          </div>
          <Tabs defaultValue="daily">
            <TabsList className="grid w-[200px] grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Similar Claims Breakdown</h3>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Auto Insurance Claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">12</span>
                  <span className="text-xs text-muted-foreground">(44%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Home Insurance Claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">8</span>
                  <span className="text-xs text-muted-foreground">(30%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Health Insurance Claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">5</span>
                  <span className="text-xs text-muted-foreground">(18%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Life Insurance Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">2</span>
                  <span className="text-xs text-muted-foreground">(8%)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2 text-sm text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span>Similar claim detection improved by 12% this week</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Incomplete Form Analysis</h3>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Missing Documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">5</span>
                  <span className="text-xs text-muted-foreground">(62%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Incorrect Policy Information</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">2</span>
                  <span className="text-xs text-muted-foreground">(25%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span className="text-sm">System Errors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">1</span>
                  <span className="text-xs text-muted-foreground">(13%)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-sm text-green-700">
              <TrendingDown className="h-4 w-4" />
              <span>Incomplete forms reduced by 27% compared to last week</span>
            </div>
            <div className="mt-2 rounded-md border p-3">
              <h4 className="font-medium">Recommended Action</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Implement guided form completion for property damage claims to reduce missing documentation issues.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
