import { Stack } from "expo-router"
import { useTheme } from "@react-navigation/native"

export default function HomeLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeStyle: {
          backgroundColor: theme.colors.background,
        },
        headerLargeTitleShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Vouchers" }} />
    </Stack>
  )
}
