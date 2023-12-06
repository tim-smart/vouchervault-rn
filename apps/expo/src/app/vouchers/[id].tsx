import React, { Suspense, useCallback, useEffect, useMemo } from "react"
import { Button, Platform, ScrollView, View } from "react-native"
import type { SearchParams } from "expo-router"
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router"
import {
  RxRef,
  useRxRef,
  useRxSetPromise,
  useRxSuspenseSuccess,
  useRxValue,
} from "@effect-rx/rx-react"
import * as Schema from "@effect/schema/Schema"
import { Option } from "effect"

import { Voucher, VoucherCreate, VoucherId } from "@vv/vouchers"

import { AndroidForm } from "~/VoucherForm/components/AndroidForm"
import { IosForm } from "~/VoucherForm/components/IosForm"
import { createVoucherRx, updateVoucherRx, voucherByIdRx } from "~/Vouchers"

export default function VoucherForm() {
  const params = useLocalSearchParams<SearchParams<"/vouchers/[id]">>()
  const id = Option.some(params.id).pipe(
    Option.filter(id => id !== "new"),
    Option.map(id => VoucherId(Number(id))),
  )

  return (
    <>
      <Stack.Screen
        redirect={undefined}
        options={{
          title: Option.match(id, {
            onNone: () => "New Voucher",
            onSome: () => "Edit Voucher",
          }),
        }}
      />
      <ScrollView style={{ flex: 1 }}>
        <View className="h-5" />
        <Suspense>
          {Option.match(id, {
            onNone: () => <NewForm />,
            onSome: id => <EditForm id={id} />,
          })}
        </Suspense>
      </ScrollView>
    </>
  )
}

function NewForm() {
  const voucherRef = useMemo(() => RxRef.make(Voucher.empty), [])

  const nav = useNavigation()
  useEffect(
    function () {
      nav.setOptions({
        headerRight: () => <SaveButton title="Add" voucherRef={voucherRef} />,
      })
    },
    [nav, voucherRef],
  )

  return <Form voucherRef={voucherRef} />
}

function EditForm(props: { readonly id: VoucherId }) {
  const result = useRxSuspenseSuccess(voucherByIdRx(props.id))
  const voucherRef = useMemo(
    () => RxRef.make(result.value as VoucherCreate),
    [result.value],
  )

  const nav = useNavigation()
  useEffect(
    function () {
      nav.setOptions({
        headerRight: () => <SaveButton title="Save" voucherRef={voucherRef} />,
      })
    },
    [nav, voucherRef],
  )

  return <Form voucherRef={voucherRef} />
}

const validateCreate = Schema.is(VoucherCreate)

function SaveButton({
  voucherRef,
  title,
}: {
  readonly voucherRef: RxRef.RxRef<VoucherCreate>
  readonly title: string
}) {
  const rx = useMemo(
    () =>
      "id" in voucherRef.value
        ? (updateVoucherRx as typeof createVoucherRx)
        : createVoucherRx,
    [voucherRef],
  )
  const mutate = useRxSetPromise(rx)
  const save = useCallback(
    function () {
      mutate(voucherRef.value).then(_ => {
        if (_._tag === "Success") {
          router.back()
        }
      })
    },
    [voucherRef, mutate],
  )

  const valid = useRxRef(voucherRef.map(validateCreate))
  const waiting = useRxValue(rx, _ => _.waiting)
  const disabled = waiting || !valid

  return <Button title={title} onPress={() => save()} disabled={disabled} />
}

function Form({
  voucherRef,
}: {
  readonly voucherRef: RxRef.RxRef<VoucherCreate>
}) {
  return Platform.OS === "ios" ? (
    <IosForm voucherRef={voucherRef} />
  ) : (
    <AndroidForm voucherRef={voucherRef} />
  )
}
