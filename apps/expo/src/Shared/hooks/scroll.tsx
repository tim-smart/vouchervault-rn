import { useCallback, useLayoutEffect, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { useNavigation } from "expo-router"
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
