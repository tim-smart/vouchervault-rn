import { Button, useColorScheme } from "react-native"
import { router, Stack } from "expo-router"
import { ThemeProvider } from "@react-navigation/native"

import * as Theme from "~/shared/Theme"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === "dark" ? Theme.Dark : Theme.Light}>
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
    </ThemeProvider>
  )
}
