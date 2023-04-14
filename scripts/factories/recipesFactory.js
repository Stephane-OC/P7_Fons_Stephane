function recipesFactory(recipe) {
  const { id, name, servings, ingredients, time, description, appliance, ustensils } = recipe;

  const articleElement = document.createElement('article');
  articleElement.classList.add('recipes');
  articleElement.id = id;
  articleElement.dataset.appliance = appliance;
  articleElement.dataset.ustensils = ustensils;
  articleElement.dataset.servings = servings;
  articleElement.tabIndex = 0;

  const divImg = document.createElement('div');
  divImg.classList.add('recipe-img');

  const divDetails = document.createElement('div');
  divDetails.classList.add('recipe-details');

  const divHeadText = document.createElement('div');
  divHeadText.classList.add('recipe-head-text');

  const h2 = document.createElement('h2');
  h2.textContent = name;

  const spanTimer = document.createElement('span');
  spanTimer.classList.add('timer');
  spanTimer.innerHTML = `<i class="far fa-clock"></i> ${time} min`;

  const divContainDetails = document.createElement('div');
  divContainDetails.classList.add('contain-details');

  const ulIngredients = document.createElement('ul');
  ulIngredients.classList.add('recipes-ingredients');
  ingredients.forEach((ingredient) => {
    const li = document.createElement('li');
    li.textContent = `${ingredient.ingredient}: ${ingredient.quantity ?? ''} ${ingredient.unit ?? ''}`;
    ulIngredients.appendChild(li);
  });

  const pDescription = document.createElement('p');
  pDescription.classList.add('recipes-description');
  pDescription.textContent = `${description.substring(0, 180)}${description.length > 180 ? "..." : ""}`;

  // Append elements
  divHeadText.appendChild(h2);
  divHeadText.appendChild(spanTimer);
  divContainDetails.appendChild(ulIngredients);
  divContainDetails.appendChild(pDescription);
  divDetails.appendChild(divHeadText);
  divDetails.appendChild(divContainDetails);
  articleElement.appendChild(divImg);
  articleElement.appendChild(divDetails);

  return { recipe, getRecipes: () => articleElement };
}

export { recipesFactory };