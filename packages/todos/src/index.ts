import * as Http from "@effect/platform-browser/HttpClient"
import * as Schema from "@effect/schema/Schema"
import { Context, Effect, Layer, Option, Stream } from "effect"

export class Todo extends Schema.Class<Todo>()({
  id: Schema.number,
  title: Schema.string,
  completed: Schema.boolean,
}) {
  static readonly array = Schema.array(Todo)
  static readonly chunk = Schema.chunk(Todo)
}

const make = Effect.gen(function* (_) {
  const defaultClient = yield* _(Http.client.Client)
  const client = defaultClient.pipe(
    Http.client.mapRequest(
      Http.request.prependUrl("https://jsonplaceholder.typicode.com"),
    ),
    Http.client.filterStatusOk,
  )

  const getTodos = Http.request.get("/todos")
  const todosChunk = Http.response.schemaBodyJson(Todo.chunk)
  const todos = (perPage: number) =>
    Stream.paginateChunkEffect(1, page =>
      Effect.logInfo(`Fetching page ${page} of todos`).pipe(
        Effect.zipRight(
          getTodos.pipe(
            Http.request.setUrlParams({
              _page: page.toString(),
              _limit: perPage.toString(),
            }),
            client,
          ),
        ),
        Effect.flatMap(todosChunk),
        Effect.map(chunk => [
          chunk,
          Option.some(page + 1).pipe(
            Option.filter(() => chunk.length === perPage),
          ),
        ]),
      ),
    )

  return { todos } as const
})

export interface Todos extends Effect.Effect.Success<typeof make> {}
export const tag = Context.Tag<Todos>()
export const layer = Layer.effect(tag, make).pipe(Layer.use(Http.client.layer))
