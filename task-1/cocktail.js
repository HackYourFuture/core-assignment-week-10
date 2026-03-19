// API documentation: https://www.thecocktaildb.com/api.php

import path from "path";
import { writeFile } from "fs/promises";

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Add helper functions as needed here

export async function main() {
  if (process.argv.length < 3) {
    console.error("Please provide a cocktail name as a command line argument.");
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `./output/${cocktailName}.md`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.drinks) {
      throw new Error("No cocktails found.");
    }

    let markdown = "# Cocktail Recipes\n\n";

    for (const drink of data.drinks) {
      markdown += `## ${drink.strDrink}\n\n`;

      markdown += `![${drink.strDrink}](${drink.strDrinkThumb}/medium)\n\n`;

      const isAlcoholic = drink.strAlcoholic === "Alcoholic" ? "Yes" : "No";
      markdown += `**Category**: ${drink.strCategory}\n\n`;
      markdown += `**Alcoholic**: ${isAlcoholic}\n\n`;

      markdown += `### Ingredients\n\n`;
      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        if (!ingredient) break;
        if (measure) {
          markdown += `- ${measure.trim()} ${ingredient}\n`;
        } else {
          markdown += `- ${ingredient}\n`;
        }
      }

      markdown += `\n`;

      markdown += `### Instructions\n\n`;
      markdown += `${drink.strInstructions}\n\n`;
      markdown += `Serve in: ${drink.strGlass}\n\n`;
    }

    await writeFile(outPath, markdown);
  } catch (error) {
    console.error(error.message);
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
