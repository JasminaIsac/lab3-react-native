import { Text, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface MealItem {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strMealThumb?: string;
  strIngredient1?: string;
}

interface RecipeCardProps {
  item: MealItem;
}

export default function RecipeCard({ item }: RecipeCardProps) {
  const image =
    item.strMealThumb ||
    "https://thecrites.com/sites/all/modules/cookbook/theme/images/default-recipe-big.png";

  return (
    <Link
      href={{ pathname: "/recipe/[id]", params: { id: item.idMeal } }}
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
          <Text style={styles.name}>{item.strMeal}</Text>
          {item.strCategory && <Text style={styles.category}>{item.strCategory}</Text>}
          {item.strIngredient1 && (
            <Text style={styles.ingredient}>Main: {item.strIngredient1}</Text>
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
  category: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 2,
  },
  ingredient: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
    fontStyle: "italic",
  },
});
