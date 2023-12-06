import type { ExpoConfig } from "@expo/config"

const defineConfig = (): ExpoConfig => ({
  name: "Voucher Vault",
  slug: "vouchervault",
  scheme: "vouchervault",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "co.timsmart.vouchervault",
    supportsTablet: true,
  },
  android: {
    package: "co.timsmart.vouchervault2",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router", "./expo-plugins/with-modify-gradle.js"],
})

export default defineConfig
