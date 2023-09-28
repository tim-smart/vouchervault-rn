import { DarkTheme, DefaultTheme } from "@react-navigation/native"

export const Light = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

export const Dark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
  },
}
