import React, { Suspense, useCallback, useEffect, useMemo } from "react"
import { Button, ScrollView, Text, TextInput, View } from "react-native"
import type { SearchParams } from "expo-router"
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import {
  RxRef,
  useRxRef,
  useRxSet,
  useRxSuspenseSuccess,
} from "@effect-rx/rx-react"
import * as Schema from "@effect/schema/Schema"
import { Option } from "effect"

import { Voucher, VoucherCreate, VoucherId } from "@vv/vouchers"

import { createVoucherRx, updateVoucherRx, voucherByIdRx } from "~/Vouchers/Rx"

export default function VoucherForm() {
  const params = useLocalSearchParams<SearchParams<"/vouchers/[id]">>()
  const id = Option.some(params.id).pipe(
    Option.filter(id => id !== "new"),
    Option.map(Number),
  )

  let voucherRef: RxRef.RxRef<VoucherCreate>
  if (id._tag === "None") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    voucherRef = useMemo(() => RxRef.make(Voucher.empty), [])
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useRxSuspenseSuccess(voucherByIdRx(VoucherId(id.value)))
    // eslint-disable-next-line react-hooks/rules-of-hooks
    voucherRef = useMemo(
      () => RxRef.make(result.value as VoucherCreate),
      [result.value],
    )
  }

  const nav = useNavigation()
  useEffect(
    function () {
      nav.setOptions({
        title: Option.match(id, {
          onNone: () => "Add Voucher",
          onSome: _id => "Edit Voucher",
        }),
        headerRight: () => <SaveButton voucherRef={voucherRef} />,
      })
    },
    [nav, id, voucherRef],
  )

  return (
    <ScrollView style={{ flex: 1 }}>
      <Suspense>
        <Form voucherRef={voucherRef} />
      </Suspense>
    </ScrollView>
  )
}

const validateCreate = Schema.is(VoucherCreate)

function SaveButton({
  voucherRef,
}: {
  readonly voucherRef: RxRef.RxRef<VoucherCreate>
}) {
  const rx = useMemo(
    () =>
      "id" in voucherRef.value
        ? (updateVoucherRx as typeof createVoucherRx)
        : createVoucherRx,
    [voucherRef],
  )
  const mutate = useRxSet(rx)
  const save = useCallback(
    function () {
      mutate(voucherRef.value)
      router.back()
    },
    [voucherRef, mutate],
  )

  const valid = useRxRef(voucherRef.map(validateCreate))

  return <Button title="Save" onPress={() => save()} disabled={!valid} />
}

function Form({
  voucherRef,
}: {
  readonly voucherRef: RxRef.RxRef<VoucherCreate>
}) {
  const voucher = useRxRef(voucherRef)
  return (
    <View>
      <Text>Name: {voucher.name}</Text>
      <TextInput
        value={voucher.name}
        onChange={e =>
          voucherRef.update(_ => ({ ..._, name: e.nativeEvent.text }))
        }
      />
    </View>
  )
}
