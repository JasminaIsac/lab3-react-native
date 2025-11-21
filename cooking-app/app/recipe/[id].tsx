import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getMealById } from "services/api";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchMeal() {
      try {
        const result = await getMealById(id);
        setMeal(result);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff914d" />
        <Text style={{ marginTop: 8, color: "#555" }}>Loading recipe...</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found 🍳</Text>
      </View>
    );
  }

  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ingredient = meal[`strIngredient${i + 1}`];
    const measure = meal[`strMeasure${i + 1}`];
    return ingredient && ingredient.trim()
      ? { ingredient, measure: measure?.trim() || "" }
      : null;
  }).filter(Boolean);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: meal.strMealThumb }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>{meal.strMeal}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥣 Ingredients</Text>
        <View style={styles.card}>
          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <Text key={index} style={styles.ingredientText}>
                • {item!.ingredient}{" "}
                <Text style={styles.measureText}>({item!.measure})</Text>
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>No ingredients available</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Instructions</Text>
        <View style={styles.card}>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ff914d",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFF9F5",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  measureText: {
    color: "#777",
    fontSize: 15,
  },
  instructions: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  emptyText: {
    color: "#777",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
  },
});
