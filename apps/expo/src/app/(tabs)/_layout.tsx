import { useColorScheme } from "react-native"
import { BlurView } from "expo-blur"
import { Tabs } from "expo-router"

export const unstable_settings = {
  initialRouteName: "(home)",
}

export default function TabsLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            style={{
              flex: 1,
              borderBottomColor:
                colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.1)",
              borderBottomWidth: 1,
            }}
            tint={colorScheme!}
            intensity={100}
          />
        ),
        tabBarStyle: { position: "absolute" },
        tabBarBackground: () => (
          <BlurView style={{ flex: 1 }} tint={colorScheme!} />
        ),
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
  )
}
