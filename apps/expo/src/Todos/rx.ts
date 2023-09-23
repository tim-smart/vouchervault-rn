import { Rx, RxRef } from "@effect-rx/rx-react"
import { Effect, Stream } from "effect"

import * as Todos from "@acme/todos"

const todosRuntime = Rx.runtime(Todos.layer, { autoDispose: true })

export const stream = Rx.streamPull(
  () =>
    Stream.unwrap(Effect.map(Todos.tag, _ => _.todos(25))).pipe(
      Stream.bufferChunks({ capacity: 1 }),
      Stream.map(RxRef.make),
    ),
  { runtime: todosRuntime },
).pipe(Rx.refreshable)
