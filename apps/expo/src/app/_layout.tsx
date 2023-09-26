import { useColorScheme } from "react-native"
import { BlurView } from "expo-blur"
import { Tabs } from "expo-router"
import { ThemeProvider } from "@react-navigation/native"

import * as Theme from "~/shared/Theme"

export const unstable_settings = {
  initialRouteName: "(home)",
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === "dark" ? Theme.Dark : Theme.Light}>
      <Tabs
        screenOptions={{
          headerShown: false,
          headerTransparent: true,
          tabBarStyle: { position: "absolute" },
          tabBarBackground: () => <BlurView style={{ flex: 1 }} />,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Vouchers",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
          }}
        />
      </Tabs>
    </ThemeProvider>
  )
}
