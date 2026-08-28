const { db } = require('./firebase-admin-client');
const { CUISINES, RECIPES_PER_CUISINE, buildCuisineRecipes, buildAllRecipes } = require('./recipe-templates');

async function seedCuisine(cuisine) {
  const recipes = buildCuisineRecipes(cuisine);
  const updates = {};
  for (const [id, recipe] of Object.entries(recipes)) {
    updates[`recipes/${id}`] = recipe;
  }
  await db.ref().update(updates);
  return Object.keys(recipes).length;
}

async function clearCuisine(cuisine) {
  const updates = {};
  for (let i = 1; i <= RECIPES_PER_CUISINE; i++) {
    updates[`recipes/seed-${cuisine}-${i}`] = null;
  }
  await db.ref().update(updates);
}

async function seedAll() {
  const recipes = buildAllRecipes();
  await db.ref('recipes').set(recipes);
  return Object.keys(recipes).length;
}

async function clearAll() {
  await db.ref('recipes').remove();
}

async function run() {
  const command = process.argv[2];
  const cuisineArg = process.argv[3];

  if (command === 'clear' && cuisineArg) {
    await clearCuisine(cuisineArg);
    console.log(`Rezepte für "${cuisineArg}" gelöscht.`);
  } else if (command === 'clear') {
    await clearAll();
    console.log('Alle Rezepte gelöscht.');
  } else if (command === 'seed' && cuisineArg) {
    const count = await seedCuisine(cuisineArg);
    console.log(`${count} Rezepte für "${cuisineArg}" geschrieben.`);
  } else if (command === 'seed') {
    const count = await seedAll();
    console.log(`${count} Rezepte geschrieben (${RECIPES_PER_CUISINE} pro Kochstil).`);
  } else {
    console.log('Nutzung:');
    console.log('  node scripts/seed-recipes.js seed                 (alle Kochstile)');
    console.log('  node scripts/seed-recipes.js seed <cuisine>        z.B. italian');
    console.log('  node scripts/seed-recipes.js clear                (alle Kochstile)');
    console.log('  node scripts/seed-recipes.js clear <cuisine>');
    console.log(`  Verfügbare Kochstile: ${CUISINES.join(', ')}`);
    process.exit(1);
  }
}

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fehler:', error);
      process.exit(1);
    });
}

module.exports = { seedCuisine, clearCuisine, seedAll, clearAll };
