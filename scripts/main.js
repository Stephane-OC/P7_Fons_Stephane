import { recipes } from '../data/recipes.js';
import { recipesFactory } from './factories/recipesFactory.js';

const recipesContain = document.querySelector('#recipes-contain');

/*  "displayRecipes" function retrieves "recipesContain" DOM element, clears its content,             **
**  generates recipe cards for each item in the recipes array by using "recipesFactory"               ** 
**  function. Resulted recipe cards are appended to "recipesContain" element.                         **
**  "displayRecipes" function is called with recipes array as its parameter to display recipe cards.  */
function displayRecipes(recipes) {
  recipesContain.innerHTML = '';
  recipes.forEach((item) => {
    const recipeTemplate = recipesFactory(item);
    const recipeDom = recipeTemplate.getRecipes();
    recipesContain.appendChild(recipeDom);
  });
}

displayRecipes(recipes);