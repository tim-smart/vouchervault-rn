import React from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link } from "expo-router"

export default function About() {
  return (
    <SafeAreaView className="bg-[#1F104A]">
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>
        <Link href="/">Home</Link>
      </View>
    </SafeAreaView>
  )
}
