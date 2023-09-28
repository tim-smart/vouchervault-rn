import React, { Suspense, useCallback, useEffect, useMemo } from "react"
import type { TextInputProps } from "react-native"
import {
  Button,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import DatePicker from "react-native-date-picker"
import type { SearchParams } from "expo-router"
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import {
  Result,
  RxRef,
  useRxRef,
  useRxSetPromise,
  useRxSuspenseSuccess,
  useRxValue,
} from "@effect-rx/rx-react"
import * as Schema from "@effect/schema/Schema"
import { Ionicons } from "@expo/vector-icons"
import { flow, Option, String } from "effect"
import {
  HStack,
  Section,
  Text,
  TextField,
  useUIColor,
  VStack,
} from "swiftui-react-native"

import { Voucher, VoucherCreate, VoucherId } from "@vv/vouchers"

import type { Binding } from "~/Shared/hooks/binding"
import {
  useRxRefBinding,
  useRxRefBindingIdentity,
} from "~/Shared/hooks/binding"
import * as Millis from "~/Shared/Milliunits"
import { createVoucherRx, updateVoucherRx, voucherByIdRx } from "~/Vouchers/Rx"

export default function VoucherForm() {
  const params = useLocalSearchParams<SearchParams<"/vouchers/[id]">>()
  const id = Option.some(params.id).pipe(
    Option.filter(id => id !== "new"),
    Option.map(id => VoucherId(Number(id))),
  )

  return (
    <ScrollView style={{ flex: 1 }}>
      <View className="h-5" />
      <Suspense>
        {Option.match(id, {
          onNone: () => <NewForm />,
          onSome: id => <EditForm id={id} />,
        })}
      </Suspense>
    </ScrollView>
  )
}

function NewForm() {
  const voucherRef = useMemo(() => RxRef.make(Voucher.empty), [])

  const nav = useNavigation()
  useEffect(
    function () {
      nav.setOptions({
        title: "Add Voucher",
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
        title: "Edit Voucher",
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
  const waiting = useRxValue(rx, Result.isWaiting)
  const disabled = waiting || !valid

  return <Button title={title} onPress={() => save()} disabled={disabled} />
}

const emptySpace = " ".repeat(100)

function Form({
  voucherRef,
}: {
  readonly voucherRef: RxRef.RxRef<VoucherCreate>
}) {
  return (
    <VStack>
      <Section>
        <TextField
          placeholder={`Name${emptySpace}`}
          autocapitalization="words"
          autocorrectionDisabled
          text={useRxRefBindingIdentity(voucherRef, "name")}
        />
      </Section>

      <Section>
        <Label text="Expires">
          <DatePickerWrap
            date={useRxRefBindingIdentity(voucherRef, "expiresAt")}
          />
        </Label>
        <Label text="Balance">
          <NumberField
            style={{ alignContent: "flex-end" }}
            placeholder="Amount"
            text={useRxRefBinding(
              voucherRef,
              "balance",
              Millis.toStringOption,
              Millis.fromString,
            )}
          />
        </Label>
      </Section>
      <Section header="Notes">
        <TextField
          placeholder={emptySpace}
          textEditor
          text={useRxRefBinding(
            voucherRef,
            "notes",
            Option.getOrElse(() => ""),
            flow(Option.some, Option.filter(String.isNonEmpty)),
          )}
        />
      </Section>
    </VStack>
  )
}

function NumberField(
  props: TextInputProps & {
    readonly text: Binding<string>
  },
) {
  const [value, setValueString] = React.useState(props.text.value)
  useEffect(
    function () {
      props.text.setValue(value)
    },
    [props, value],
  )
  const theme = useUIColor()
  return (
    <TextInput
      placeholder={props.placeholder}
      placeholderTextColor={theme.secondaryLabel}
      keyboardType="decimal-pad"
      textAlign="right"
      style={{ fontSize: 17 }}
      value={value}
      onChangeText={e => setValueString(e)}
    />
  )
}

function Label(props: {
  readonly text: string
  readonly children: React.ReactNode
}) {
  return (
    <HStack>
      <Text alignment="leading" style={{ width: 80 }}>
        {props.text}
      </Text>
      <View style={{ flex: 1 }}>{props.children}</View>
    </HStack>
  )
}

function DatePickerWrap(props: {
  readonly date: Binding<Option.Option<Date>>
  readonly placeholder?: string
}) {
  const [show, setShow] = React.useState(false)
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Pressable style={{ flex: 1 }} onPress={() => setShow(true)}>
        <Text
          alignment="trailing"
          foregroundColor={Option.match(props.date.value, {
            onNone: () => "secondaryLabel",
            onSome: () => undefined,
          })}
        >
          {Option.match(props.date.value, {
            onNone: () => props.placeholder ?? "Never",
            onSome: date => date.toLocaleDateString(),
          })}
        </Text>
      </Pressable>
      {Option.match(props.date.value, {
        onNone: () => null,
        onSome: () => (
          <>
            <View style={{ width: 10 }} />
            <TouchableOpacity
              onPress={() => props.date.setValue(Option.none())}
            >
              <Ionicons name="close-circle" size={18} />
            </TouchableOpacity>
          </>
        ),
      })}
      {show && (
        <DatePicker
          modal
          mode="date"
          open={show}
          date={Option.getOrElse(props.date.value, () => new Date())}
          onConfirm={date => {
            setShow(false)
            return props.date.setValue(Option.some(date))
          }}
          onCancel={() => setShow(false)}
        />
      )}
    </View>
  )
}
