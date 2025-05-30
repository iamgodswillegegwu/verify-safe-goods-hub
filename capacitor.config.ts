
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.99bab1ba1baa428285bedc40aac2898a',
  appName: 'verify-safe-goods-hub',
  webDir: 'dist',
  server: {
    url: 'https://99bab1ba-1baa-4282-85be-dc40aac2898a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#3b82f6'
    }
  }
};

export default config;
