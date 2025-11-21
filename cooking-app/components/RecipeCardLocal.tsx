import { Text, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ingredient } from "services/db";

interface Recipe {
  id: number;
  name: string;
  instructions: string;
  image?: string | null;
  ingredients?: Ingredient[];
}

interface CardProps {
  item: Recipe;
}

export default function MyRecipeCard({ item }: CardProps) {

  const image =
    item.image && item.image.trim() !== ""
      ? item.image
      : "https://thecrites.com/sites/all/modules/cookbook/theme/images/default-recipe-big.png";

    const ingredientsText = item.ingredients
      ? item.ingredients
          .slice(0, 3)
          .map((ing) => `• ${ing.name}${ing.quantity ? `: ${ing.quantity}` : ""}`)
          .join(" ")
      : "";

  return (
    <Link
      href={{ pathname: "/myrecipes/[id]", params: { id: item.id } }}
      style={styles.container}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        >
          <Text style={styles.name}>{item.name}</Text>
          {ingredientsText ? (
            <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
              {ingredientsText}...
            </Text>
          ) : (
            <Text style={styles.subtitle}>Ingrediente lipsă</Text>
          )}
        </LinearGradient>
      </ImageBackground>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  imageBackground: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradient: {
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 2,
  },
});
