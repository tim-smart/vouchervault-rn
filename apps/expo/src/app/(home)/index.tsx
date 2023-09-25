import React from "react"
import { View } from "react-native"
import { useHeaderHeight } from "@react-navigation/elements"

import { VouchersList } from "~/Vouchers/components/List"

export default function Index() {
  const topPadding = useHeaderHeight()
  return (
    <View style={{ flex: 1 }}>
      <VouchersList topPadding={topPadding} />
    </View>
  )
}
