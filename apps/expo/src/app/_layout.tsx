import { useEffect, useMemo } from "react"
import { Button, Platform, useColorScheme } from "react-native"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { router, Stack } from "expo-router"
import { useMaterial3Theme } from "@pchmn/expo-material3-theme"
import { ThemeProvider } from "@react-navigation/native"
import { EnvironmentProvider, useEnvironment } from "swiftui-react-native"

import { AndroidAppBar } from "~/Shared/AndroidAppBar"
import * as Theme from "~/Shared/Theme"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

function Routes() {
  return (
    <Stack
      screenOptions={
        Platform.OS === "ios"
          ? {}
          : {
              header: props => <AndroidAppBar {...props} />,
            }
      }
    >
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
  )
}

export default function RootLayout() {
  return Platform.OS === "ios" ? <IosLayout /> : <AndroidLayout />
}

function IosLayout() {
  const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === "dark" ? Theme.Dark : Theme.Light}>
      <EnvironmentProvider>
        <SyncColorScheme />
        <Routes />
      </EnvironmentProvider>
    </ThemeProvider>
  )
}

function AndroidLayout() {
  const colorScheme = useColorScheme()
  const { theme } = useMaterial3Theme()
  const navTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? {
            dark: true,
            colors: {
              ...Theme.Dark,
              ...theme.dark,
            },
          }
        : {
            dark: false,
            colors: {
              ...Theme.Light,
              ...theme.light,
            },
          },
    [colorScheme, theme],
  )
  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme],
  )

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    <ThemeProvider value={navTheme as any}>
      <PaperProvider theme={paperTheme}>
        <Routes />
      </PaperProvider>
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
