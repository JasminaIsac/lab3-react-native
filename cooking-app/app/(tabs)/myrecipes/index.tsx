import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getAllRecipes, Recipe } from "services/db";
import CustomButton from "@components/CustomButton";
import RecipeCardLocal from "@components/RecipeCardLocal";
import SearchBar from "@components/SearchBar";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  const [query, setQuery] = useState<string>("");

  const handleSearch = async () => {
    try {
      const results: Recipe[] = await getAllRecipes(query || "");
      setRecipes(results || []);
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
  };

  const loadRecipes = async () => {
    try {
      const data: Recipe[] = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Local Recipes</Text>
      <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} placeholder="Ex: pizza" />

      <Text style={styles.title}>My Recipes</Text>
      {recipes.length === 0 && <Text style={styles.noData}>No recipes found</Text>}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => <RecipeCardLocal item={item} />}
        showsVerticalScrollIndicator={false}
      />

      <CustomButton
        title={"➕ Add recipe"}
        onPress={() => router.push("/myrecipes/add")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
    marginBottom: 10 
  },
  noData: { 
    fontSize: 16, 
    textAlign: "center",
    color: "#6A6887",
    marginTop: 20,
  },
});
