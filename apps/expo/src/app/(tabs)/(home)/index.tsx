import React from "react"
import { useHeaderHeight } from "@react-navigation/elements"

import { VouchersList } from "~/Vouchers/components/List"

export default function Index() {
  const topPadding = useHeaderHeight()
  return <VouchersList topPadding={topPadding} />
}
