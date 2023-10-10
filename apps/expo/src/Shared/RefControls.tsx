import { useCallback, useState } from "react"
import type { TextInputProps } from "react-native-paper"
import { TextInput } from "react-native-paper"
import type { RxRef } from "@effect-rx/rx-react"
import { useRxRef } from "@effect-rx/rx-react"
import { Option } from "effect"

import * as Millis from "@vv/utils/Milliunits"

export function RefTextInput(
  props: Omit<TextInputProps, "value"> & {
    readonly textRef: RxRef.RxRef<string>
  },
) {
  const value = useRxRef(props.textRef)
  return (
    <TextInput
      {...props}
      value={value}
      onChangeText={_ => props.textRef.set(_)}
    />
  )
}

export function RefTextOptionInput(
  props: Omit<TextInputProps, "value"> & {
    readonly textRef: RxRef.RxRef<Option.Option<string>>
  },
) {
  const [value, setString] = useState(() =>
    Option.getOrElse(props.textRef.value, () => ""),
  )
  const setValue = useCallback(
    (value: string) => {
      setString(value)

      const str = value.trim()
      if (str === "") {
        props.textRef.set(Option.none())
      } else {
        props.textRef.set(Option.some(str))
      }
    },
    [props.textRef, setString],
  )
  return <TextInput {...props} value={value} onChangeText={setValue} />
}

export function RefMillisOptionInput(
  props: Omit<TextInputProps, "value"> & {
    readonly numberRef: RxRef.RxRef<Option.Option<number>>
  },
) {
  const [value, setString] = useState(() =>
    Millis.toStringOption(props.numberRef.value),
  )
  const setValue = useCallback(
    (value: string) => {
      const number = value.replace(/[^0-9.]/g, "")
      setString(number)

      if (number === "") {
        props.numberRef.set(Option.none())
      } else {
        props.numberRef.set(Millis.fromString(number))
      }
    },
    [props.numberRef, setString],
  )
  return (
    <TextInput
      keyboardType="decimal-pad"
      {...props}
      value={value}
      onChangeText={setValue}
    />
  )
}
