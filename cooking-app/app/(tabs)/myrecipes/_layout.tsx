import { FC } from "react";
import { Stack } from "expo-router";

const MyRecipesLayout: FC = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Recipes" }} />
      <Stack.Screen name="add" options={{ title: "Add Recipe" }} />
      <Stack.Screen name="[id]" options={{ title: "Recipe Details" }} />
    </Stack>
  );
};

export default MyRecipesLayout;
