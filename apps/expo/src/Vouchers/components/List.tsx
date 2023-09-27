import { Button, Text, TouchableOpacity, View } from "react-native"
import { useRxSet, useRxValue } from "@effect-rx/rx-react"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"

import type { Voucher } from "@vv/vouchers"

import { clearVouchersRx, vouchersRx } from "~/Vouchers/Rx"

export function VouchersList({ topPadding }: { topPadding: number }) {
  const result = useRxValue(vouchersRx)
  const vouchers = result._tag === "Success" ? result.value : []
  return (
    <FlashList
      ListHeaderComponent={() => <Header topPadding={topPadding} />}
      estimatedItemSize={100}
      data={vouchers}
      renderItem={renderItem}
    />
  )
}
function renderItem({ item }: ListRenderItemInfo<Voucher>) {
  return <VoucherCard voucher={item} />
}

function Header({ topPadding }: { topPadding: number }) {
  return (
    <View>
      <View style={{ height: topPadding + 50 }} />
      <ClearButton />
      <View className="h-5" />
    </View>
  )
}

function VoucherCard({ voucher }: { voucher: Voucher }) {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      className="items-center justify-center rounded-xl px-5 py-4"
    >
      <Text>{voucher.name}</Text>
    </TouchableOpacity>
  )
}

function ClearButton() {
  const clear = useRxSet(clearVouchersRx)
  return <Button title="Clear" onPress={() => clear()} />
}
