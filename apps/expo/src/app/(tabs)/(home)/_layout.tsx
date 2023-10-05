import { Platform, TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"

import { AndroidAppBar } from "~/Shared/AndroidAppBar"

export default function HomeLayout() {
  return Platform.select({
    ios: <IosLayout />,
    default: <AndroidLayout />,
  })
}

function IosLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.dark
            ? "rgba(0, 0, 0, 0.01)"
            : "rgba(255, 255, 255, 0.01)",
        },
        headerBlurEffect: "regular",
        headerLargeTitle: true,
        headerLargeStyle: { backgroundColor: theme.colors.background },
        headerLargeTitleShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Vouchers",
          headerRight: () => (
            <Link href="/vouchers/new" asChild>
              <TouchableOpacity>
                <Ionicons
                  name="ios-add-circle"
                  size={30}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Stack>
  )
}

function AndroidLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Vouchers",
          header: props => <AndroidAppBar {...props} />,
        }}
      />
    </Stack>
  )
}
