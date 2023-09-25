import { Button, View } from "react-native"
import { useRxSet, useRxValue } from "@effect-rx/rx-react"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"
import { Option } from "effect"

import type { Voucher } from "@vv/vouchers"

import {
  clearVouchersRx,
  createVoucherRx,
  updateVoucherRx,
  vouchersRx,
} from "~/Vouchers/Rx"

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
  return <Card voucher={item} />
}

function Header({ topPadding }: { topPadding: number }) {
  return (
    <View>
      <View style={{ height: topPadding + 50 }} />
      <ClearButton />
      <CreateButton />
      <View className="h-5" />
    </View>
  )
}

function Card({ voucher }: { voucher: Voucher }) {
  const update = useRxSet(updateVoucherRx)
  return (
    <Button
      title={voucher.name}
      onPress={() =>
        update({
          id: voucher.id,
          name: voucher.name + "!",
        })
      }
    />
  )
}

function CreateButton() {
  const create = useRxSet(createVoucherRx)
  return (
    <Button
      title="Create"
      onPress={() => create({ name: "Test", balance: Option.some(50) })}
    />
  )
}

function ClearButton() {
  const clear = useRxSet(clearVouchersRx)
  return <Button title="Clear" onPress={() => clear()} />
}
