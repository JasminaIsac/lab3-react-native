import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6D45",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cook Book",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myrecipes"
        options={{
          title: "My Recipes",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
