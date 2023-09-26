import React, { Suspense } from "react"
import { ScrollView, Switch, Text, View } from "react-native"
import { useRxSet, useRxSuspenseSuccess } from "@effect-rx/rx-react"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { useTheme } from "@react-navigation/native"
import { ReadonlyArray } from "effect"

import type { Setting } from "@vv/settings"

import { useNavBlurView } from "~/app/Shared/hooks/scroll"
import { settingRx, smartScan } from "~/Settings"

export default function Settings() {
  const paddingTop = useHeaderHeight()
  const paddingBottom = useBottomTabBarHeight()
  const onScroll = useNavBlurView()

  return (
    <ScrollView
      style={{ flex: 1, paddingTop, paddingBottom }}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View className="h-5" />
      <Suspense>
        <Group>
          <SettingToggle setting={smartScan} />
        </Group>
        <Group title="Import / export">
          <SettingToggle setting={smartScan} />
        </Group>
      </Suspense>
    </ScrollView>
  )
}

function Group(props: {
  readonly title?: string
  readonly children: React.ReactNode
}) {
  const theme = useTheme()
  return (
    <>
      <View className="p-3">
        {props.title && (
          <Text className="mb-2 px-4 text-xs uppercase text-gray-500 dark:text-gray-400">
            {props.title}
          </Text>
        )}
        <View
          className="rounded-lg"
          style={{ backgroundColor: theme.colors.card }}
        >
          {ReadonlyArray.intersperse(
            Array.isArray(props.children) ? props.children : [props.children],
            <>
              <View className="h-2" />
              <View className="border-b border-gray-100" />
              <View className="h-2" />
            </>,
          )}
        </View>
      </View>
    </>
  )
}

function SettingToggle({ setting }: { readonly setting: Setting<boolean> }) {
  const rx = settingRx(setting)
  const result = useRxSuspenseSuccess(rx)
  const set = useRxSet(rx)
  const theme = useTheme()
  return (
    <View className="flex-row px-4 py-2">
      <Text className="text-lg" style={{ color: theme.colors.text }}>
        {setting.label}
      </Text>
      <View className="flex-1" />
      <Switch value={result.value} onChange={e => set(e.nativeEvent.value)} />
    </View>
  )
}
