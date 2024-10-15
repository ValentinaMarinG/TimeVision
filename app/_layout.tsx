import { Stack } from "expo-router";
import React from "react";

export default function Layout() {

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="tickets" />
        <Stack.Screen name="profile" />
      </Stack>
      
    </>
  );
}
