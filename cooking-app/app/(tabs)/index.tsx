import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { searchMeals } from "services/api";
import SearchBar from "@components/SearchBar";
import RecipeCard from "@components/RecipeCard";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  [key: string]: any;
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSearch() {
    try {
      setLoading(true);
      const results: Meal[] = await searchMeals(query || "");
      setMeals(results || []);
    } catch (error) {
      console.error(error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Online Recipes</Text>
      <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} placeholder="Ex: pizza" />

      <Text style={styles.title}>Popular Recipes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6D45" />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <RecipeCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  searchBar: {
    marginBottom: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
