import { useEffect } from "react"
import { Button, useColorScheme } from "react-native"
import { router, Stack } from "expo-router"
import { ThemeProvider } from "@react-navigation/native"
import { EnvironmentProvider, useEnvironment } from "swiftui-react-native"

import * as Theme from "~/Shared/Theme"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === "dark" ? Theme.Dark : Theme.Light}>
      <EnvironmentProvider>
        <SyncColorScheme />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="vouchers/[id]"
            options={{
              presentation: "modal",
              headerLeft: () => (
                <Button title="Cancel" onPress={() => router.back()} />
              ),
            }}
          />
        </Stack>
      </EnvironmentProvider>
    </ThemeProvider>
  )
}

function SyncColorScheme() {
  const env = useEnvironment()
  const colorScheme = useColorScheme() ?? "light"
  useEffect(() => {
    env.setValues({ colorScheme })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme])
  return null
}
