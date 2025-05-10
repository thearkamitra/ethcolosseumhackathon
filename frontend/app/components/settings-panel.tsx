"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

// Define the form schema for general settings
const generalFormSchema = z.object({
  notifications: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  language: z.enum(["english", "spanish", "french"], {
    required_error: "Please select a language.",
  }),
  policyUpdates: z.boolean().default(true),
  billingAlerts: z.boolean().default(true),
})

// Define the form schema for API settings
const apiFormSchema = z.object({
  apiUrl: z.string().url({ message: "Please enter a valid URL" }),
  agentMode: z.enum(["direct", "agent"], {
    required_error: "Please select an agent mode.",
  }),
  debugMode: z.boolean().default(false),
})

export default function SettingsPanel() {
  // Settings tab state
  const [activeTab, setActiveTab] = useState("general");

  // General settings form
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      notifications: true,
      darkMode: false,
      language: "english",
      policyUpdates: true,
      billingAlerts: true,
    },
  })

  // API settings form
  const apiForm = useForm<z.infer<typeof apiFormSchema>>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      agentMode: "direct",
      debugMode: false,
    },
  })

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    try {
      // General settings
      const savedGeneralSettings = localStorage.getItem('generalSettings');
      if (savedGeneralSettings) {
        generalForm.reset(JSON.parse(savedGeneralSettings));
      }
      
      // API settings
      const savedApiSettings = localStorage.getItem('apiSettings');
      if (savedApiSettings) {
        apiForm.reset(JSON.parse(savedApiSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Submit handler for general settings
  function onGeneralSubmit(data: z.infer<typeof generalFormSchema>) {
    localStorage.setItem('generalSettings', JSON.stringify(data));
    alert('General settings saved!');
  }

  // Submit handler for API settings
  function onApiSubmit(data: z.infer<typeof apiFormSchema>) {
    localStorage.setItem('apiSettings', JSON.stringify(data));
    
    // Update environment variable (this will only work until page refresh)
    if (typeof window !== 'undefined') {
      (window as any).process = {
        ...(window as any).process,
        env: {
          ...(window as any).process?.env,
          NEXT_PUBLIC_API_URL: data.apiUrl
        }
      };
    }
    
    alert('API settings saved! You may need to refresh the page for changes to take effect.');
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your application preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-8">
                  <FormField
                    control={generalForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your preferred language for the interface.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="darkMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Dark Mode</FormLabel>
                          <FormDescription>
                            Enable dark mode for the interface.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications for new messages and updates.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure backend API settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...apiForm}>
                <form onSubmit={apiForm.handleSubmit(onApiSubmit)} className="space-y-8">
                  <FormField
                    control={apiForm.control}
                    name="apiUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API URL</FormLabel>
                        <FormControl>
                          <Input placeholder="http://localhost:8000" {...field} />
                        </FormControl>
                        <FormDescription>
                          The URL of the backend API server.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={apiForm.control}
                    name="agentMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent Mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="direct" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Direct Mode (Use LLM directly)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="agent" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Agent Mode (Use LLM with tools/memory)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Choose how the backend should process messages.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={apiForm.control}
                    name="debugMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Debug Mode</FormLabel>
                          <FormDescription>
                            Enable debug logging and features.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save API Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account settings are managed through your organization's admin portal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
