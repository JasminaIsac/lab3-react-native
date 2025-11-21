import * as SQLite from "expo-sqlite";

export interface Ingredient {
  id?: number;
  name: string;
  quantity?: string;
}

export interface Recipe {
  id: number;
  name: string;
  instructions: string;
  image?: string;
  ingredients?: Ingredient[];
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function normalizeString(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("cookbook.db");
    const db = await dbPromise;

    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        instructions TEXT,
        image TEXT
      );

      CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        recipe_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        quantity TEXT,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
      );
    `);
  }
  return dbPromise;
}

export async function saveRecipe(
  name: string,
  ingredients: Ingredient[],
  instructions: string,
  image?: string
): Promise<void> {
  const db = await getDB();

  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      "INSERT INTO recipes (name, instructions, image) VALUES (?, ?, ?)",
      [name, instructions, image ?? null]
    );
    const recipeId = result.lastInsertRowId;

    for (const { name: ingName, quantity } of ingredients) {
      const normalizedName = ingName.trim().toLowerCase();

      let ingredient = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM ingredients WHERE name = ?",
        [normalizedName]
      );

      let ingredientId: number;

      if (ingredient) {
        ingredientId = ingredient.id;
      } else {
        const insertResult = await db.runAsync(
          "INSERT INTO ingredients (name) VALUES (?)",
          [normalizedName]
        );
        ingredientId = insertResult.lastInsertRowId;
      }

      await db.runAsync(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)",
        [recipeId, ingredientId, quantity ?? null]
      );
    }
  });
}

export async function updateRecipe(
  id: number,
  name: string,
  ingredients: Ingredient[],
  instructions: string,
  image?: string
): Promise<void> {
  const db = await getDB();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      "UPDATE recipes SET name = ?, instructions = ?, image = ? WHERE id = ?",
      [name, instructions, image ?? null, id]
    );

    await db.runAsync("DELETE FROM recipe_ingredients WHERE recipe_id = ?", [id]);

    for (const { name: ingName, quantity } of ingredients) {
      const normalizedName = ingName.trim().toLowerCase();

      let ingredient = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM ingredients WHERE name = ?",
        [normalizedName]
      );

      let ingredientId: number;

      if (ingredient) {
        ingredientId = ingredient.id;
      } else {
        const insertResult = await db.runAsync(
          "INSERT INTO ingredients (name) VALUES (?)",
          [normalizedName]
        );
        ingredientId = insertResult.lastInsertRowId;
      }

      await db.runAsync(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)",
        [id, ingredientId, quantity ?? null]
      );
    }
  });
}

export async function getAllRecipes(keyword?: string): Promise<Recipe[]> {
  const db = await getDB();

  let recipes: Recipe[];

  if (keyword && keyword.trim() !== "") {
    const normalized = normalizeString(keyword.trim());

    const all = await db.getAllAsync<Recipe>("SELECT * FROM recipes");

    recipes = all.filter((r) =>
      normalizeString(r.name).includes(normalized)
    );
  } else {
    recipes = await db.getAllAsync<Recipe>("SELECT * FROM recipes");
  }

  for (const recipe of recipes) {
    if (!recipe.id) continue;

    const ingredients = await db.getAllAsync<Ingredient>(
      `
      SELECT i.name, ri.quantity
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = ?
      `,
      [recipe.id]
    );

    recipe.ingredients = ingredients;

    if (keyword && keyword.trim() !== "") {
      const normalized = normalizeString(keyword.trim());
      const hasMatchingIngredient = ingredients.some((ing) =>
        normalizeString(ing.name).includes(normalized)
      );
      const matchesName = normalizeString(recipe.name).includes(normalized);

      if (!hasMatchingIngredient && !matchesName) {
        recipes = recipes.filter((r) => r.id !== recipe.id);
      }
    }
  }

  return recipes;
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const db = await getDB();

  const recipe = await db.getFirstAsync<Recipe>(
    "SELECT * FROM recipes WHERE id = ?",
    [id]
  );

  if (!recipe) return null;

  const ingredients = await db.getAllAsync<Ingredient>(
    `
    SELECT i.name, ri.quantity
    FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE ri.recipe_id = ?;
    `,
    [id]
  );

  recipe.ingredients = ingredients;
  return recipe;
}

export async function deleteRecipe(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync("DELETE FROM recipes WHERE id = ?", [id]);
}

export async function getRecipeIngredients(): Promise<Ingredient[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Ingredient>("SELECT * FROM ingredients");
  return rows;
}

export default {
  getDB,
  saveRecipe,
  updateRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe,
};
