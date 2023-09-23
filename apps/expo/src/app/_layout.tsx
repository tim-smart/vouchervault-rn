import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f472b6",
          },
        }}
      />
      <StatusBar style="light" />
    </>
  );
}
