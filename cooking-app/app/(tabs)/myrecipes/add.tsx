import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router"; 
import { saveRecipe, updateRecipe, getRecipeById } from "services/db";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";

interface Ingredient {
  name: string;
  quantity?: string;
}

export default function AddRecipe() {
  const { edit, id } = useLocalSearchParams();
  const isEdit = edit === "true";
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string>("");
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        const recipe = await getRecipeById(Number(id));
        if (recipe) {
          setName(recipe.name);
          setInstructions(recipe.instructions);
          setImage(recipe.image || "");
          setIngredients(recipe.ingredients || []);
        }
      })();
    }
  }, [isEdit, id]);

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { name: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || ingredients.length === 0 || !instructions.trim()) {
      Alert.alert("Error", "Complete all fields!");
      return;
    }

    const filteredIngredients = ingredients.filter(i => i.name.trim());
    if (filteredIngredients.length === 0) {
      Alert.alert("Error", "Add at least one ingredient!");
      return;
    }

    try {
      if (isEdit && id) {
        await updateRecipe(Number(id), name.trim(), filteredIngredients, instructions.trim(), image);
        Alert.alert("Succes", "Recipe updated successfully!");
      } else {
        await saveRecipe(name.trim(), filteredIngredients, instructions.trim(), image);
        Alert.alert("Succes", "Recipe saved successfully!");
      }
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? "Edit recipe" : "Add recipe"}</Text>
      
      <CustomInput onChangeText={setName} value={name} placeholder="Ex: Pizza" />

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <CustomInput
            placeholder="Ex: Flour"
            value={ingredient.name}
            onChangeText={(value) => handleIngredientChange(index, "name", value)}
            style={styles.inputSmall}
          />
          <CustomInput
            placeholder="Ex: 1 cup"
            value={ingredient.quantity || ""}
            onChangeText={(value) => handleIngredientChange(index, "quantity", value)}
            style={styles.inputSmall}
          />
          <Pressable style={styles.removeBtn} onPress={() => handleRemoveIngredient(index)}>
            <Text style={{ color: "white" }}>✕</Text>
          </Pressable>
        </View>
      ))}

      <CustomButton type='secondary' title="+ Add ingredient" onPress={handleAddIngredient} />

      <CustomInput onChangeText={setInstructions} value={instructions} placeholder="Instructions" multiline />

      <CustomButton title={image ? "Change image" : "Add image"} onPress={pickImage} /> 
      {image ? (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: image }} style={styles.thumbnail} />
        </View>
      ) : null}

      <CustomButton title={isEdit ? "Update" : "Save"} onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#fff"
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginVertical: 10
  },
  ingredientRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 4,
  },
  inputSmall: {
    flex: 1,
    marginRight: 6,
  },
  removeBtn: { 
    backgroundColor: "red", 
    padding: 6, 
    borderRadius: 8,
  },  
  addIngredientBtn: { 
    backgroundColor: "#FF6D45", 
    padding: 8, 
    borderRadius: 8, 
    alignItems: "center",
    marginVertical: 8 
  },
  addIngredientText: { 
    color: "#fff" 
  },
  button: { 
    backgroundColor: "#ff914d", 
    padding: 10, 
    borderRadius: 8, 
    alignItems: "center", 
    marginVertical: 6 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  thumbnailContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
});
