import React, { Suspense } from "react"
import { View } from "react-native"
import { useHeaderHeight } from "@react-navigation/elements"

import { VouchersList } from "~/Vouchers/components/List"

export default function Index() {
  const topPadding = useHeaderHeight()
  return (
    <View style={{ flex: 1 }}>
      <Suspense>
        <VouchersList topPadding={topPadding} />
      </Suspense>
    </View>
  )
}

// function TodoList() {
//   const result = useRxSuspenseSuccess(Todos.stream)
//   const pull = useSetRx(Todos.stream)
//   return (
//     <FlashList
//       data={result.value.items}
//       estimatedItemSize={60}
//       ItemSeparatorComponent={() => <View className="h-2" />}
//       onEndReachedThreshold={0.8}
//       onEndReached={() => pull()}
//       keyExtractor={_ => _.value.id.toString()}
//       renderItem={renderTodo}
//     />
//   )
// }

// function renderTodo(_: ListRenderItemInfo<RxRef.RxRef<Todo>>) {
//   return <TodoCard todoRef={_.item} />
// }

// function RefreshButton() {
//   const refresh = useRefreshRx(Todos.stream)
//   return <Button title="Refresh" color={"#f472b6"} onPress={() => refresh()} />
// }

// function TodoCard(props: { readonly todoRef: RxRef.RxRef<Todo> }) {
//   const todo = useRxRef(props.todoRef)
//   const toggle = useCallback(() => {
//     props.todoRef.update(_ => ({ ..._, completed: !_.completed }))
//   }, [props.todoRef])
//   return (
//     <View className="flex flex-row rounded-lg bg-white/10 p-4">
//       <View className="flex-grow">
//         <TouchableOpacity>
//           <Text className="text-xl font-semibold text-pink-400">
//             {todo.title}
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity onPress={toggle}>
//         <Text className="font-bold uppercase text-pink-400">
//           {todo.completed ? "Complete" : "Incomplete"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   )
// }
