import React, { useEffect } from "react"
import type { TextInputProps } from "react-native"
import { Pressable, TextInput, TouchableOpacity, View } from "react-native"
import DatePicker from "react-native-date-picker"
import type { RxRef } from "@effect-rx/rx-react"
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

import * as Millis from "@vv/utils/Milliunits"
import type { VoucherCreate } from "@vv/vouchers"

import type { Binding } from "~/Shared/hooks/binding"
import {
  useRxRefBinding,
  useRxRefBindingIdentity,
} from "~/Shared/hooks/binding"

const emptySpace = " ".repeat(100)

export function IosForm({
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
