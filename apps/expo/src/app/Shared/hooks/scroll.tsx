import { useCallback, useLayoutEffect, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { BlurView } from "expo-blur"
import { useNavigation } from "expo-router"
import { useTheme } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"

type Nav = NavigationProp<ReactNavigation.RootParamList>

export function useScrolled(offset = 0) {
  const [scrolled, setScrolled] = useState(false)
  const onScroll = useCallback(
    function (e: NativeSyntheticEvent<NativeScrollEvent>) {
      if (e.nativeEvent.contentOffset.y > offset) {
        if (!scrolled) {
          setScrolled(true)
        }
      } else {
        if (scrolled) {
          setScrolled(false)
        }
      }
    },
    [offset, scrolled],
  )
  return [scrolled, onScroll] as const
}

export function useNavOnScroll<T = Nav>(
  onStart: (_: T) => void,
  onScrolled: (_: T) => void,
  offset = 0,
) {
  const [scrolled, onScroll] = useScrolled(offset)
  const nav = useNavigation<T>()
  useLayoutEffect(() => {
    if (scrolled) {
      onScrolled(nav)
    } else {
      onStart(nav)
    }
  }, [scrolled, nav, onScrolled, onStart])
  return onScroll
}

const borderBlur = (
  <BlurView
    style={{
      flex: 1,
      borderBottomColor: "rgba(0, 0, 0, 0.1)",
      borderBottomWidth: 1,
    }}
    intensity={100}
  />
)
const noBorderBlurDark = (
  <BlurView
    style={{
      flex: 1,
      borderBottomWidth: 0,
    }}
    tint="dark"
    intensity={100}
  />
)
const borderBlurDark = (
  <BlurView
    style={{
      flex: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.15)",
      borderBottomWidth: 1,
    }}
    tint="dark"
    intensity={100}
  />
)

export function useNavBlurView() {
  const theme = useTheme()
  return useNavOnScroll(
    function (nav) {
      nav.setOptions({
        headerBackground: theme.dark ? () => noBorderBlurDark : undefined,
      })
    },
    function (nav) {
      nav.setOptions({
        headerBackground: () => (theme.dark ? borderBlurDark : borderBlur),
      })
    },
    30,
  )
}
