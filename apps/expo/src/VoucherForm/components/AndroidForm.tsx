import { View } from "react-native"
import type { RxRef } from "@effect-rx/rx-react"
import { useRxRefProp } from "@effect-rx/rx-react"

import type { VoucherCreate } from "@vv/vouchers"

import {
  RefMillisOptionInput,
  RefTextInput,
  RefTextOptionInput,
} from "~/Shared/RefControls"

export function AndroidForm({
  voucherRef,
}: {
  readonly voucherRef: RxRef.RxRef<VoucherCreate>
}) {
  return (
    <View className="px-3">
      <RefTextInput
        textRef={useRxRefProp(voucherRef, "name")}
        mode="outlined"
        label="Name"
        autoCapitalize="words"
      />
      <RefMillisOptionInput
        mode="outlined"
        label="Balance"
        numberRef={useRxRefProp(voucherRef, "balance")}
      />
      <RefTextOptionInput
        textRef={useRxRefProp(voucherRef, "notes")}
        mode="outlined"
        label="Notes"
        multiline
      />
    </View>
  )
}
