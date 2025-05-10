
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from "@/lib/mock-data";

interface TrendChartProps {
  data: ChartData[];
  title: string;
  description?: string;
}

export function TrendChart({ data, title, description }: TrendChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="handledByAI" 
              name="Handled by AI (%)" 
              stroke="#0055AA" 
              strokeWidth={2}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="escalated" 
              name="Escalated (%)" 
              stroke="#FF4444" 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
