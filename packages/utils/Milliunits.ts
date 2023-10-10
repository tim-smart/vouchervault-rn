import { Option } from "effect"

export function fromDecimal(d: number): number {
  return Math.round(d * 1000)
}

export function fromString(s: string): Option.Option<number> {
  return Option.some(parseFloat(s)).pipe(
    Option.filter(_ => !isNaN(_)),
    Option.map(fromDecimal),
  )
}

export function toDecimal(n: number): number {
  return n / 1000
}

export function toString(n: number): string {
  return toDecimal(n).toFixed(2)
}

export function toStringOption(n: Option.Option<number>): string {
  return Option.map(n, toString).pipe(Option.getOrElse(() => ""))
}
