const BASE = 'https://www.themealdb.com/api/json/v1/1';

export async function searchMeals(q) {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(q)}`);
  const json = await res.json();
  return json.meals || [];
}

export async function getMealById(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  const json = await res.json();
  return json.meals ? json.meals[0] : null;
}

export async function fetchMealsByCategory(category) {
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  const json = await res.json();
  return json.meals || [];
}

export default { searchMeals, getMealById, fetchMealsByCategory };