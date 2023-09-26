import { Stack } from "expo-router"
import { useTheme } from "@react-navigation/native"

export default function HomeLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.01)",
        },
        headerBlurEffect: "regular",
        headerLargeTitle: true,
        headerLargeStyle: { backgroundColor: theme.colors.background },
        headerLargeTitleShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Vouchers" }} />
    </Stack>
  )
}
