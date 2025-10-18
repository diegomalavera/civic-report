import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diegomalavera.civicreportapp',
  appName: 'Reportes Comunitarios',
  webDir: 'dist/civic-report-app/browser',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: '#007BFF',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
