/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SetStateAction } from "react"
import { useCallback, useMemo } from "react"
import type { Result, Rx, RxRef } from "@effect-rx/rx-react"
import { useRxRef, useRxSet, useRxSuspenseSuccess } from "@effect-rx/rx-react"
import { identity } from "effect"

export interface Binding<A> {
  value: A
  setValue: (_: SetStateAction<A>) => void
}

export function useRxRefBinding<
  A extends Record<string, any>,
  P extends keyof A,
  B,
>(ref: RxRef.RxRef<A>, key: P, f: (_: A[P]) => B, g: (value: B) => A[P]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bRef = useMemo(() => ref.map(_ => f(_[key])), [ref, key])
  const value = useRxRef(bRef)

  const setValue = (value: SetStateAction<B>) => {
    ref.update(_ => ({
      ..._,
      [key]: g(typeof value === "function" ? (value as any)(_[key]) : value),
    }))
  }
  return {
    value,
    setValue,
  }
}

export function useRxRefBindingIdentity<
  A extends Record<string, any>,
  P extends keyof A,
>(ref: RxRef.RxRef<A>, key: P) {
  return useRxRefBinding(ref, key, identity, identity)
}

export function useRxBinding<E, A>(rx: Rx.Writable<Result.Result<E, A>, A>) {
  const { value } = useRxSuspenseSuccess(rx)
  const set = useRxSet(rx)
  const setValue = useCallback(
    function (_: SetStateAction<A>) {
      set(typeof _ === "function" ? (_ as any)(value) : _)
    },
    [set, value],
  )
  return { value, setValue }
}

export function useRxBindingBoolean<E>(
  rx: Rx.Writable<Result.Result<E, boolean>, boolean>,
) {
  const { value, setValue } = useRxBinding(rx)
  return { value, setValue, toggle: () => setValue(_ => !_) }
}
