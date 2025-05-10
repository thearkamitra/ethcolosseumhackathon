
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { GlobeIcon, LanguagesIcon, Save } from "lucide-react";

export default function Language() {
  const languages = [
    { id: "en", name: "English", code: "EN", enabled: true },
    { id: "de", name: "German", code: "DE", enabled: true },
    { id: "fr", name: "French", code: "FR", enabled: true },
    { id: "it", name: "Italian", code: "IT", enabled: true },
    { id: "es", name: "Spanish", code: "ES", enabled: false },
    { id: "pt", name: "Portuguese", code: "PT", enabled: false },
  ];
  
  const regions = [
    { id: "ch", name: "Switzerland", defaultLang: "de" },
    { id: "de", name: "Germany", defaultLang: "de" },
    { id: "fr", name: "France", defaultLang: "fr" },
    { id: "it", name: "Italy", defaultLang: "it" },
    { id: "uk", name: "United Kingdom", defaultLang: "en" },
  ];
  
  const handleSaveChanges = () => {
    toast({
      title: "Language settings saved",
      description: "Your changes have been applied successfully",
    });
  };
  
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Language & Region</h1>
        <p className="text-muted-foreground">Configure language settings and regional preferences</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <LanguagesIcon className="h-5 w-5" />
              Supported Languages
            </CardTitle>
            <CardDescription>
              Select which languages your AI assistant will support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languages.map((language) => (
                <div key={language.id} className="flex items-center space-x-2">
                  <Checkbox id={`lang-${language.id}`} defaultChecked={language.enabled} />
                  <Label
                    htmlFor={`lang-${language.id}`}
                    className="flex items-center gap-2"
                  >
                    <span className="inline-block w-8 text-sm font-medium text-muted-foreground">
                      {language.code}
                    </span>
                    {language.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <GlobeIcon className="h-5 w-5" />
              Regional Defaults
            </CardTitle>
            <CardDescription>
              Set default languages for different regions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {regions.map((region) => (
              <div key={region.id} className="space-y-2">
                <h3 className="font-medium">{region.name}</h3>
                <RadioGroup defaultValue={region.defaultLang}>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.filter(l => l.enabled).map((language) => (
                      <div key={language.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={language.id}
                          id={`${region.id}-${language.id}`}
                        />
                        <Label htmlFor={`${region.id}-${language.id}`}>{language.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="shadow-card col-span-full">
          <CardHeader className="pb-2">
            <CardTitle>Translation Settings</CardTitle>
            <CardDescription>
              Configure how translations are handled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-translate responses</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically translate responses to the user's preferred language
                  </p>
                </div>
                <Switch defaultChecked id="auto-translate" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show original text</p>
                  <p className="text-sm text-muted-foreground">
                    Display the original text alongside the translation
                  </p>
                </div>
                <Switch id="show-original" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language detection</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically detect the language of incoming queries
                  </p>
                </div>
                <Switch defaultChecked id="lang-detection" />
              </div>
              
              <Button onClick={handleSaveChanges} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Language Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
