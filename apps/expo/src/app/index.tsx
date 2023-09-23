import React, { Suspense, useCallback } from "react"
import { Button, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link } from "expo-router"
import type { RxRef } from "@effect-rx/rx-react"
import {
  useRefreshRx,
  useRxRef,
  useRxSuspenseSuccess,
  useSetRx,
} from "@effect-rx/rx-react"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"

import type { Todo } from "@acme/todos"

import * as Todos from "~/Todos/rx"

export default function Index() {
  return (
    <SafeAreaView className="bg-[#1F104A]">
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>
        <Link href="/about">About</Link>

        <RefreshButton />

        <Suspense fallback={<Text>Loading...</Text>}>
          <TodoList />
        </Suspense>
      </View>
    </SafeAreaView>
  )
}

function TodoList() {
  const result = useRxSuspenseSuccess(Todos.stream)
  const pull = useSetRx(Todos.stream)
  return (
    <FlashList
      data={result.value.items}
      estimatedItemSize={60}
      ItemSeparatorComponent={() => <View className="h-2" />}
      onEndReachedThreshold={0.8}
      onEndReached={() => pull()}
      keyExtractor={_ => _.value.id.toString()}
      renderItem={renderTodo}
    />
  )
}

function renderTodo(_: ListRenderItemInfo<RxRef.RxRef<Todo>>) {
  return <TodoCard todoRef={_.item} />
}

function RefreshButton() {
  const refresh = useRefreshRx(Todos.stream)
  return <Button title="Refresh" color={"#f472b6"} onPress={() => refresh()} />
}

function TodoCard(props: { readonly todoRef: RxRef.RxRef<Todo> }) {
  const todo = useRxRef(props.todoRef)
  const toggle = useCallback(() => {
    props.todoRef.update(_ => ({ ..._, completed: !_.completed }))
  }, [props.todoRef])
  return (
    <View className="flex flex-row rounded-lg bg-white/10 p-4">
      <View className="flex-grow">
        <TouchableOpacity>
          <Text className="text-xl font-semibold text-pink-400">
            {todo.title}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggle}>
        <Text className="font-bold uppercase text-pink-400">
          {todo.completed ? "Complete" : "Incomplete"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
