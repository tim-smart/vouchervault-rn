import React, { Suspense } from "react"
import { ScrollView, View } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { HStack, Section, Spacer, Text, Toggle } from "swiftui-react-native"

import type { Setting } from "@vv/settings"

import { settingRx, smartScan } from "~/Settings"
import { useRxBindingBoolean } from "~/Shared/hooks/binding"

export default function Settings() {
  const paddingTop = useHeaderHeight()
  const paddingBottom = useBottomTabBarHeight()

  return (
    <ScrollView style={{ flex: 1, paddingTop, paddingBottom }}>
      <View className="h-5" />
      <Suspense>
        <Section>
          <SettingToggle setting={smartScan} />
          <SettingToggle setting={smartScan} />
        </Section>

        <Section header="Import / export">
          <SettingToggle setting={smartScan} />
        </Section>
      </Suspense>
    </ScrollView>
  )
}

function SettingToggle({ setting }: { readonly setting: Setting<boolean> }) {
  const binding = useRxBindingBoolean(settingRx(setting))
  return (
    <HStack>
      <Text>{setting.label}</Text>
      <Spacer />
      <Toggle isOn={binding} />
    </HStack>
  )
}
