
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Globe, 
  Settings, 
  TestTube, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { getValidationStats } from '@/services/apiAggregationService';
import { validateProductExternal } from '@/services/externalApiService';

interface APISettings {
  openFoodFacts: {
    enabled: boolean;
    rateLimitPerMinute: number;
  };
  fdaDrugs: {
    enabled: boolean;
    rateLimitPerMinute: number;
  };
  cosing: {
    enabled: boolean;
    rateLimitPerMinute: number;
  };
  gs1: {
    enabled: boolean;
    apiKey: string;
    rateLimitPerMinute: number;
  };
  caching: {
    enabled: boolean;
    ttlHours: number;
  };
}

const ExternalAPISettings = () => {
  const [settings, setSettings] = useState<APISettings>({
    openFoodFacts: { enabled: true, rateLimitPerMinute: 60 },
    fdaDrugs: { enabled: true, rateLimitPerMinute: 30 },
    cosing: { enabled: true, rateLimitPerMinute: 20 },
    gs1: { enabled: false, apiKey: '', rateLimitPerMinute: 10 },
    caching: { enabled: true, ttlHours: 24 }
  });

  const [stats, setStats] = useState({
    totalValidations: 0,
    verifiedProducts: 0,
    riskDistribution: {} as Record<string, number>,
    topSources: {} as Record<string, number>
  });

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getValidationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Here you would normally save to your backend/database
      localStorage.setItem('externalApiSettings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "External API settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async (apiName: string) => {
    setLoading(true);
    try {
      let testProduct = '';
      switch (apiName) {
        case 'openFoodFacts':
          testProduct = 'Coca Cola';
          break;
        case 'fdaDrugs':
          testProduct = 'Aspirin';
          break;
        case 'cosing':
          testProduct = 'Shampoo';
          break;
        default:
          testProduct = 'Test Product';
      }

      const result = await validateProductExternal(testProduct);
      const success = result.found && result.confidence > 0;
      
      setTestResults(prev => ({
        ...prev,
        [apiName]: success
      }));

      toast({
        title: `${apiName} Test`,
        description: success ? "API test successful" : "API test failed",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [apiName]: false
      }));
      
      toast({
        title: "API Test Failed",
        description: `Failed to test ${apiName} API`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (enabled: boolean, apiName: string) => {
    if (!enabled) {
      return <Badge variant="secondary">Disabled</Badge>;
    }
    
    const tested = testResults[apiName];
    if (tested === true) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
    } else if (tested === false) {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
    }
    
    return <Badge variant="outline">Untested</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="h-6 w-6" />
          External API Configuration
        </h2>
        <p className="text-gray-600 mt-2">
          Configure and monitor external product validation APIs
        </p>
      </div>

      {/* Statistics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Validation Statistics (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalValidations}</div>
              <div className="text-sm text-gray-600">Total Validations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.verifiedProducts}</div>
              <div className="text-sm text-gray-600">Verified Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.riskDistribution.high || 0}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((stats.verifiedProducts / Math.max(stats.totalValidations, 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Food Facts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Open Food Facts
              </span>
              <div className="flex items-center gap-2">
                {getStatusBadge(settings.openFoodFacts.enabled, 'openFoodFacts')}
                <Switch
                  checked={settings.openFoodFacts.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      openFoodFacts: { ...prev.openFoodFacts, enabled: checked } 
                    }))
                  }
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rate Limit (requests/minute)</Label>
              <Input
                type="number"
                value={settings.openFoodFacts.rateLimitPerMinute}
                onChange={(e) => 
                  setSettings(prev => ({ 
                    ...prev, 
                    openFoodFacts: { ...prev.openFoodFacts, rateLimitPerMinute: parseInt(e.target.value) || 60 } 
                  }))
                }
                disabled={!settings.openFoodFacts.enabled}
              />
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => testAPI('openFoodFacts')}
              disabled={!settings.openFoodFacts.enabled || loading}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test API
            </Button>
          </CardContent>
        </Card>

        {/* FDA Drugs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                FDA Drug Database
              </span>
              <div className="flex items-center gap-2">
                {getStatusBadge(settings.fdaDrugs.enabled, 'fdaDrugs')}
                <Switch
                  checked={settings.fdaDrugs.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      fdaDrugs: { ...prev.fdaDrugs, enabled: checked } 
                    }))
                  }
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rate Limit (requests/minute)</Label>
              <Input
                type="number"
                value={settings.fdaDrugs.rateLimitPerMinute}
                onChange={(e) => 
                  setSettings(prev => ({ 
                    ...prev, 
                    fdaDrugs: { ...prev.fdaDrugs, rateLimitPerMinute: parseInt(e.target.value) || 30 } 
                  }))
                }
                disabled={!settings.fdaDrugs.enabled}
              />
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => testAPI('fdaDrugs')}
              disabled={!settings.fdaDrugs.enabled || loading}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test API
            </Button>
          </CardContent>
        </Card>

        {/* CosIng Cosmetics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                CosIng (EU Cosmetics)
              </span>
              <div className="flex items-center gap-2">
                {getStatusBadge(settings.cosing.enabled, 'cosing')}
                <Switch
                  checked={settings.cosing.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      cosing: { ...prev.cosing, enabled: checked } 
                    }))
                  }
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rate Limit (requests/minute)</Label>
              <Input
                type="number"
                value={settings.cosing.rateLimitPerMinute}
                onChange={(e) => 
                  setSettings(prev => ({ 
                    ...prev, 
                    cosing: { ...prev.cosing, rateLimitPerMinute: parseInt(e.target.value) || 20 } 
                  }))
                }
                disabled={!settings.cosing.enabled}
              />
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => testAPI('cosing')}
              disabled={!settings.cosing.enabled || loading}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test API
            </Button>
          </CardContent>
        </Card>

        {/* GS1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" />
                GS1 Global Registry
              </span>
              <div className="flex items-center gap-2">
                {getStatusBadge(settings.gs1.enabled, 'gs1')}
                <Switch
                  checked={settings.gs1.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      gs1: { ...prev.gs1, enabled: checked } 
                    }))
                  }
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter GS1 API key..."
                value={settings.gs1.apiKey}
                onChange={(e) => 
                  setSettings(prev => ({ 
                    ...prev, 
                    gs1: { ...prev.gs1, apiKey: e.target.value } 
                  }))
                }
                disabled={!settings.gs1.enabled}
              />
            </div>
            <div>
              <Label>Rate Limit (requests/minute)</Label>
              <Input
                type="number"
                value={settings.gs1.rateLimitPerMinute}
                onChange={(e) => 
                  setSettings(prev => ({ 
                    ...prev, 
                    gs1: { ...prev.gs1, rateLimitPerMinute: parseInt(e.target.value) || 10 } 
                  }))
                }
                disabled={!settings.gs1.enabled}
              />
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => testAPI('gs1')}
              disabled={!settings.gs1.enabled || loading}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test API
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Caching Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Caching Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Result Caching</Label>
              <p className="text-sm text-gray-600">Cache API results to reduce external calls</p>
            </div>
            <Switch
              checked={settings.caching.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ 
                  ...prev, 
                  caching: { ...prev.caching, enabled: checked } 
                }))
              }
            />
          </div>
          
          <div>
            <Label>Cache TTL (hours)</Label>
            <Input
              type="number"
              value={settings.caching.ttlHours}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  caching: { ...prev.caching, ttlHours: parseInt(e.target.value) || 24 } 
                }))
              }
              disabled={!settings.caching.enabled}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
};

export default ExternalAPISettings;
