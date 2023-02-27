/*  recipesFactory function creates an HTML element for a recipe card based     **
**  on properties of a given recipe object. It sets various attributes and      **
**  content to element and returns it as a result of function. Created element  **
**  can then be appended to DOM to display recipe card.                         */


function recipesFactory(recipe) {
  const { id, name, servings, ingredients, time, description, appliance, ustensils } = recipe;

  const articleElement = document.createElement('article');
  articleElement.classList.add('recipes');
  articleElement.id = id;
  articleElement.dataset.appliance = appliance;
  articleElement.dataset.ustensils = ustensils;
  articleElement.dataset.servings = servings;
  articleElement.tabIndex = 0;

  /*  This line uses map() method to create an array of <li> elements for each          **
  **  ingredient in recipe object, and then uses join() method to concatenate elements  **
  **  into a single string of HTML.                                                     */
  const ingredientList = ingredients.map((ingredient) => `<li>${ingredient.ingredient}: ${ingredient.quantity ?? ''} ${ingredient.unit ?? ''}</li>`).join('');

  articleElement.innerHTML = `
    <div class="recipe-img"></div>
    <div class="recipe-details">
      <div class="recipe-head-text">
        <h2>${name}</h2>
        <span class="timer"><i class="far fa-clock"></i> ${time} min</span>
      </div>
      <div class="contain-details">
        <ul class="recipes-ingredients">
          ${ingredientList}
        </ul>
        <p class="recipes-description">${description.substring(0, 180)}${description.length > 180 ? "..." : ""}</p>
      </div>
    </div>
  `;

  return { recipe, getRecipes: () => articleElement };
}

export { recipesFactory };