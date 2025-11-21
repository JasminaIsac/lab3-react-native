import React from "react";
import { Stack } from "expo-router";

const RootLayout: React.FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="recipe/[id]"
        options={{
          title: "Recipe Details",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
