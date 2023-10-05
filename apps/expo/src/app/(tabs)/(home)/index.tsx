import { Button, Platform, Text, TouchableOpacity, View } from "react-native"
import { FAB } from "react-native-paper"
import { Link, router } from "expo-router"
import { useRxSet, useRxValue } from "@effect-rx/rx-react"
import { useHeaderHeight } from "@react-navigation/elements"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"

import type { Voucher } from "@vv/vouchers"

import { clearVouchersRx, vouchersRx } from "~/Vouchers"

export default function Index() {
  const topPaddingWithoutHeader = useHeaderHeight()
  const topPadding = Platform.select({
    ios: topPaddingWithoutHeader + 50,
    default: 0,
  })
  const result = useRxValue(vouchersRx)
  const vouchers = result._tag === "Success" ? result.value : []
  return (
    <>
      <FlashList
        ListHeaderComponent={() => <Header topPadding={topPadding} />}
        estimatedItemSize={100}
        data={vouchers}
        renderItem={renderItem}
      />
      {Platform.OS === "android" && (
        <FAB
          onPress={() => router.push("/vouchers/new")}
          className="absolute bottom-5 right-5"
          label="Add Voucher"
          icon="plus"
        />
      )}
    </>
  )
}

function renderItem({ item }: ListRenderItemInfo<Voucher>) {
  return <VoucherCard voucher={item} />
}

function Header({ topPadding }: { topPadding: number }) {
  return (
    <View>
      <View style={{ height: topPadding }} />
      <View className="h-5" />
      <ClearButton />
      <View className="h-5" />
    </View>
  )
}

function VoucherCard({ voucher }: { voucher: Voucher }) {
  return (
    <Link href={`/vouchers/${voucher.id}`} asChild>
      <TouchableOpacity
        style={{ flex: 1 }}
        className="items-center justify-center rounded-xl px-5 py-4"
      >
        <Text>{voucher.name}</Text>
      </TouchableOpacity>
    </Link>
  )
}

function ClearButton() {
  const clear = useRxSet(clearVouchersRx)
  return <Button title="Clear" onPress={() => clear()} />
}
