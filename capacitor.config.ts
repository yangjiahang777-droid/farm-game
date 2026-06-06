import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.farmgame.app',
  appName: 'FARM',
  webDir: 'dist',

  android: {
    allowMixedContent: false,
    hardwareAcceleration: true,
    splashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#2d5a1b',
    },
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#2d5a1b',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#2d5a1b',
    },
  },
};

export default config;
