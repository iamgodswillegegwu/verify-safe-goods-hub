
import { useState } from 'react';
import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30
  });
  const { toast } = useToast();

  const handleSettingChange = (setting: string, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Setting Updated",
      description: "Your security setting has been updated successfully.",
    });
  };

  const handleEnableTwoFactor = () => {
    // This would integrate with Supabase MFA when configured
    toast({
      title: "Two-Factor Authentication",
      description: "Please configure MFA in your Supabase Dashboard first.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Account Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security settings and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-slate-600" />
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-600">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.twoFactorEnabled ? "default" : "secondary"}>
                {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEnableTwoFactor}
              >
                {settings.twoFactorEnabled ? "Manage" : "Enable"}
              </Button>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-slate-600" />
              <div>
                <h4 className="font-medium">Security Email Notifications</h4>
                <p className="text-sm text-slate-600">
                  Get notified about important security events
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          {/* Login Alerts */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-slate-600" />
              <div>
                <h4 className="font-medium">Login Alerts</h4>
                <p className="text-sm text-slate-600">
                  Get alerts when someone signs in to your account
                </p>
              </div>
            </div>
            <Switch
              checked={settings.loginAlerts}
              onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Follow these recommendations to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900">Use a Strong Password</h5>
                <p className="text-sm text-blue-700">
                  Your password should be at least 8 characters with uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-green-900">Enable Two-Factor Authentication</h5>
                <p className="text-sm text-green-700">
                  Add an extra layer of security by requiring a second form of authentication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-900">Monitor Your Account</h5>
                <p className="text-sm text-yellow-700">
                  Regularly check your account activity and report any suspicious behavior.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
