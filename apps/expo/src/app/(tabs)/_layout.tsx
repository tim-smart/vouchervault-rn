import { Platform, useColorScheme } from "react-native"
import { BlurView } from "expo-blur"
import { Stack, Tabs } from "expo-router"

import { AndroidAppBar } from "~/Shared/AndroidAppBar"

export const unstable_settings = {
  initialRouteName: "(home)",
}

export default function TabsLayout() {
  return Platform.select({
    ios: <IosLayout />,
    default: <AndroidLayout />,
  })
}

function IosLayout() {
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

function AndroidLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <AndroidAppBar {...props} />,
      }}
    >
      <Stack.Screen
        name="(home)"
        options={{
          title: "Vouchers",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Stack>
  )
}
