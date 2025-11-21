import { useState, useCallback } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getRecipeById, deleteRecipe, Recipe } from "services/db";
import CustomButton from "@components/CustomButton";

export default function MyRecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = id ? Number(id) : undefined;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (recipeId==null) return;

      async function load() {
        if (recipeId == null) return;
        const data = await getRecipeById(recipeId);
        setRecipe(data);
      }
      load();
    }, [recipeId])
  );

  const handleDelete = async () => {
    if (!recipeId) return;

    Alert.alert(
      "Delete recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(recipeId);
              Alert.alert("Succes", "Recipe deleted successfully!");
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Eroare", "An error occurred!");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!recipe) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#eee" }]} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{recipe.name}</Text>

        <Text style={styles.subtitle}>Ingredients:</Text>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ing, idx) => (
            <Text key={idx}>
              - {ing.name} {ing.quantity ? `: ${ing.quantity}` : ""}
            </Text>
          ))
        ) : (
          <Text>No ingredients</Text>
        )}

        <Text style={styles.subtitle}>Instructions:</Text>
        <Text>{recipe.instructions}</Text>
      </View>

      <CustomButton
        title="Edit recipe"
        onPress={() =>
          router.push({
            pathname: "/myrecipes/add",
            params: { edit: "true", id: recipe.id?.toString() },
          })
        }
      />
      <CustomButton title="Delete recipe" type="delete" onPress={handleDelete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16 
  },
  textContainer: { 
    marginTop: 10, 
    marginBottom: 20 
  },
  image: { 
    width: "100%", 
    height: 200, 
    borderRadius: 10 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
    marginVertical: 10
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 10 
  },
});
