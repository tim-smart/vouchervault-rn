/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Appbar } from "react-native-paper"
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { getHeaderTitle } from "@react-navigation/elements"
import type { NativeStackHeaderProps } from "@react-navigation/native-stack"

export function AndroidAppBar(
  props: NativeStackHeaderProps | BottomTabHeaderProps,
) {
  const title = getHeaderTitle(props.options, props.route.name)
  const back = props.navigation.canGoBack()

  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={() => props.navigation.goBack()} />}
      <Appbar.Content title={title} />
      {props.options.headerRight && props.options.headerRight({} as any)}
    </Appbar.Header>
  )
}
