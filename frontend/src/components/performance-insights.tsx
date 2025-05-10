
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface InsightProps {
  title: string;
  status: "Efficient" | "Improving" | "Needs Action";
  children: React.ReactNode;
}

const InsightStatus = ({ status }: { status: InsightProps["status"] }) => {
  const statusConfig = {
    "Efficient": { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    "Improving": { icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50" },
    "Needs Action": { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" }
  };

  const StatusIcon = statusConfig[status].icon;
  
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status].color} ${statusConfig[status].bg}`}>
      <StatusIcon className="h-3.5 w-3.5" />
      <span>{status}</span>
    </div>
  );
};

export function PerformanceInsight({ title, status, children }: InsightProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <InsightStatus status={status} />
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

export function PerformanceInsights() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Performance Insights</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceInsight title="Similar Claim Resolution" status="Efficient">
          <p className="mb-3">27 inquiries were identified as similar to previous claims, allowing for faster resolution using established claim processing protocols.</p>
          <div className="flex items-end justify-between">
            <div className="space-y-1 flex-grow mr-4">
              <div className="flex items-center justify-between text-xs">
                <span>Resolution speed</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-1.5" />
            </div>
            <span className="text-green-500 font-medium text-sm">↑12%</span>
          </div>
        </PerformanceInsight>
        
        <PerformanceInsight title="Incomplete Form Analysis" status="Improving">
          <p className="mb-3">8 incomplete claim forms detected (5.6% of total). Most common issue: missing documentation for property damage (62%).</p>
          <div className="flex items-end justify-between">
            <div className="space-y-1 flex-grow mr-4">
              <div className="flex items-center justify-between text-xs">
                <span>Form completion</span>
                <span className="font-medium">82%</span>
              </div>
              <Progress value={82} className="h-1.5" />
            </div>
            <span className="text-green-500 font-medium text-sm">↑8%</span>
          </div>
        </PerformanceInsight>
      </div>
    </div>
  );
}
