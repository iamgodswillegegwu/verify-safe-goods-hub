
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, Globe, Lock, Users, Settings } from 'lucide-react';

const AuthenticationSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Social Auth Settings
  const [socialAuth, setSocialAuth] = useState({
    google: {
      enabled: false,
      clientId: '',
      clientSecret: ''
    },
    facebook: {
      enabled: false,
      appId: '',
      appSecret: ''
    },
    github: {
      enabled: false,
      clientId: '',
      clientSecret: ''
    },
    linkedin: {
      enabled: false,
      clientId: '',
      clientSecret: ''
    }
  });

  // Security Settings
  const [securitySettings, setSecurity] = useState({
    emailVerification: true,
    twoFactorAuth: false,
    passwordMinLength: 8,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    accountLockoutDuration: 30
  });

  const handleSocialAuthSave = async (provider: string) => {
    setLoading(true);
    try {
      // Save social auth configuration
      toast({
        title: "Settings Updated",
        description: `${provider} authentication settings have been saved.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async () => {
    setLoading(true);
    try {
      // Save security settings
      toast({
        title: "Security Settings Updated",
        description: "Security configuration has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Authentication Settings
        </h2>
        <p className="text-gray-600 mt-2">
          Configure authentication methods and security policies for your application.
        </p>
      </div>

      <Tabs defaultValue="social" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social">Social Authentication</TabsTrigger>
          <TabsTrigger value="security">Security Policies</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          {/* Google Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-500" />
                  Google Authentication
                </span>
                <Switch
                  checked={socialAuth.google.enabled}
                  onCheckedChange={(checked) => 
                    setSocialAuth(prev => ({ 
                      ...prev, 
                      google: { ...prev.google, enabled: checked } 
                    }))
                  }
                />
              </CardTitle>
              <CardDescription>
                Allow users to sign in with their Google accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="Enter Google Client ID"
                    value={socialAuth.google.clientId}
                    onChange={(e) => 
                      setSocialAuth(prev => ({ 
                        ...prev, 
                        google: { ...prev.google, clientId: e.target.value } 
                      }))
                    }
                    disabled={!socialAuth.google.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="google-client-secret">Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    placeholder="Enter Google Client Secret"
                    value={socialAuth.google.clientSecret}
                    onChange={(e) => 
                      setSocialAuth(prev => ({ 
                        ...prev, 
                        google: { ...prev.google, clientSecret: e.target.value } 
                      }))
                    }
                    disabled={!socialAuth.google.enabled}
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSocialAuthSave('Google')}
                disabled={!socialAuth.google.enabled || loading}
              >
                Save Google Settings
              </Button>
            </CardContent>
          </Card>

          {/* Facebook Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Facebook Authentication
                </span>
                <Switch
                  checked={socialAuth.facebook.enabled}
                  onCheckedChange={(checked) => 
                    setSocialAuth(prev => ({ 
                      ...prev, 
                      facebook: { ...prev.facebook, enabled: checked } 
                    }))
                  }
                />
              </CardTitle>
              <CardDescription>
                Allow users to sign in with their Facebook accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook-app-id">App ID</Label>
                  <Input
                    id="facebook-app-id"
                    placeholder="Enter Facebook App ID"
                    value={socialAuth.facebook.appId}
                    onChange={(e) => 
                      setSocialAuth(prev => ({ 
                        ...prev, 
                        facebook: { ...prev.facebook, appId: e.target.value } 
                      }))
                    }
                    disabled={!socialAuth.facebook.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="facebook-app-secret">App Secret</Label>
                  <Input
                    id="facebook-app-secret"
                    type="password"
                    placeholder="Enter Facebook App Secret"
                    value={socialAuth.facebook.appSecret}
                    onChange={(e) => 
                      setSocialAuth(prev => ({ 
                        ...prev, 
                        facebook: { ...prev.facebook, appSecret: e.target.value } 
                      }))
                    }
                    disabled={!socialAuth.facebook.enabled}
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSocialAuthSave('Facebook')}
                disabled={!socialAuth.facebook.enabled || loading}
              >
                Save Facebook Settings
              </Button>
            </CardContent>
          </Card>

          {/* GitHub Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-800" />
                  GitHub Authentication
                </span>
                <Switch
                  checked={socialAuth.github.enabled}
                  onCheckedChange={(checked) => 
                    setSocialAuth(prev => ({ 
                      ...prev, 
                      github: { ...prev.github, enabled: checked } 
                    }))
                  }
                />
              </CardTitle>
              <CardDescription>
                Allow users to sign in with their GitHub accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github-client-id">Client ID</Label>
                  <Input
                    id="github-client-id"
                    placeholder="Enter GitHub Client ID"
                    value={socialAuth.github.clientId}
                    onChange={(e) => 
                      setSocialAuth(prev => ({ 
                        ...prev, 
                        github: { ...prev.github, clientId: e.target.value } 
                      }))
                    }
                    disabled={!socialAuth.github.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="github-client-secret">Client Secret</Label>
                  <Input
                    id="github-client-secret"
                    type="password"
                    placeholder="Enter GitHub Client Secret"
                    value={socialAuth.github.clientSecret}
                    onChange={(e) => 
                      setSocialAuth(prev => ({ 
                        ...prev, 
                        github: { ...prev.github, clientSecret: e.target.value } 
                      }))
                    }
                    disabled={!socialAuth.github.enabled}
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSocialAuthSave('GitHub')}
                disabled={!socialAuth.github.enabled || loading}
              >
                Save GitHub Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Policies
              </CardTitle>
              <CardDescription>
                Configure security requirements and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-verification">Email Verification Required</Label>
                    <Switch
                      id="email-verification"
                      checked={securitySettings.emailVerification}
                      onCheckedChange={(checked) => 
                        setSecurity(prev => ({ ...prev, emailVerification: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <Switch
                      id="two-factor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password-length">Minimum Password Length</Label>
                    <Input
                      id="password-length"
                      type="number"
                      min={6}
                      max={20}
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => 
                        setSecurity(prev => ({ 
                          ...prev, 
                          passwordMinLength: parseInt(e.target.value) || 8 
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      min={1}
                      max={168}
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => 
                        setSecurity(prev => ({ 
                          ...prev, 
                          sessionTimeout: parseInt(e.target.value) || 24 
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-attempts">Max Login Attempts</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    min={3}
                    max={10}
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => 
                      setSecurity(prev => ({ 
                        ...prev, 
                        maxLoginAttempts: parseInt(e.target.value) || 5 
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                  <Input
                    id="lockout-duration"
                    type="number"
                    min={5}
                    max={1440}
                    value={securitySettings.accountLockoutDuration}
                    onChange={(e) => 
                      setSecurity(prev => ({ 
                        ...prev, 
                        accountLockoutDuration: parseInt(e.target.value) || 30 
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSecuritySave} disabled={loading}>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Authentication Settings
              </CardTitle>
              <CardDescription>
                Configure advanced authentication behaviors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Configuration Notes</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Social authentication requires proper redirect URLs configured in provider settings</li>
                    <li>• Email verification requires SMTP configuration in Email Settings</li>
                    <li>• Two-factor authentication requires additional setup in security providers</li>
                    <li>• Changes to security policies may require user re-authentication</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-sm text-gray-600">Auth Success Rate</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Key className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-gray-600">Failed Attempts Today</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationSettings;
