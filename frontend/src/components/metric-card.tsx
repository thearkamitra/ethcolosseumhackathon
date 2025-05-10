
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  isPositive?: boolean;
  className?: string;
}

export function MetricCard({ title, value, change, isPositive, className }: MetricCardProps) {
  return (
    <Card className={cn("shadow-sm overflow-hidden transition-all hover:shadow-md", className)}>
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" />
      <CardContent className="pt-4">
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {typeof change !== 'undefined' && change !== 0 && (
            <div className={cn(
              "flex items-center text-xs font-medium rounded-full px-2 py-1",
              isPositive 
                ? "text-green-700 bg-green-100" 
                : "text-red-700 bg-red-100"
            )}>
              {isPositive ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
