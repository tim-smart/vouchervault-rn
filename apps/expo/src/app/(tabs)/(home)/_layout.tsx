import { TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"

export default function HomeLayout() {
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
                <Ionicons name="ios-add-circle" size={30} color="black" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Stack>
  )
}
