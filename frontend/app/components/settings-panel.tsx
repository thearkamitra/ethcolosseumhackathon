import { Globe, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPanel() {
  return (
    <div className="space-y-6 pt-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Language Settings</CardTitle>
          <CardDescription>Configure the languages for insurance communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="primary-language">Primary Language</Label>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (EN)</SelectItem>
                  <SelectItem value="de">German (DE)</SelectItem>
                  <SelectItem value="fr">French (FR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Languages</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Switch id="lang-de" />
                  <Label htmlFor="lang-de">German (DE)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="lang-fr" />
                  <Label htmlFor="lang-fr">French (FR)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="lang-es" />
                  <Label htmlFor="lang-es">Spanish (ES)</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claims Management</CardTitle>
          <CardDescription>Configure how claims are processed after hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Emergency Claims Processing</p>
                <p className="text-sm text-muted-foreground">Allow ConversAIge to initiate urgent claims</p>
              </div>
            </div>
            <Switch id="emergency-claims" defaultChecked />
          </div>

          <div className="rounded-md bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm text-green-700">Claims system connected and operating normally</p>
            </div>
            <p className="mt-1 text-xs text-green-600">Last verification: Today, 5:42 AM</p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="claims-priority">Claims Priority Level</Label>
            <Select defaultValue="high">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High (All Claims)</SelectItem>
                <SelectItem value="medium">Medium (Auto & Home Only)</SelectItem>
                <SelectItem value="low">Low (Informational Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Notification Settings</CardTitle>
          <CardDescription>Configure how agents are notified of urgent matters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <RadioGroup defaultValue="email">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="r1" />
                <Label htmlFor="r1">Email Notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="r2" />
                <Label htmlFor="r2">SMS Alert</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="r3" />
                <Label htmlFor="r3">Both Email and SMS</Label>
              </div>
            </RadioGroup>

            <Separator />

            <div className="space-y-2">
              <Label>Notification Criteria</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch id="esc-accident" defaultChecked />
                  <Label htmlFor="esc-accident">Auto accidents</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="esc-property" defaultChecked />
                  <Label htmlFor="esc-property">Property damage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="esc-medical" defaultChecked />
                  <Label htmlFor="esc-medical">Medical emergencies</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="esc-policy" />
                  <Label htmlFor="esc-policy">Policy cancellations</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
