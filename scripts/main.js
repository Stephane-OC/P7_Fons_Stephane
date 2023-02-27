import { recipes } from "../data/recipes.js";
import { recipesFactory } from "./factories/recipesFactory.js";

const recipesContain = document.querySelector("#recipes-contain");

const listIngredients = document.getElementById("ingredients-list");
const listAppliances = document.getElementById("appliances-list");
const listUstensils = document.getElementById("ustensils-list");

const ingredientsToggle = document.getElementById("ingredients-chevron");
const appareilsToggle = document.getElementById("appliances-chevron");
const ustensilsToggle = document.getElementById("ustensils-chevron");

const ingredientsSearch = document.getElementById("ingredients");
const appliancesSearch = document.getElementById("appliances");
const utensilsSearch = document.getElementById("ustensils");

const cssProperties = document.querySelectorAll(".advanced-find");
let recipesFiltered = [];


 /*  "displayRecipes" function retrieves "recipesContain" DOM element, clears its content,             **
 **  generates recipe cards for each item in the recipes array by using "recipesFactory"               **
 **  function. Resulted recipe cards are appended to "recipesContain" element.                         **
 **  "displayRecipes" function is called with recipes array as its parameter to display recipe cards.  */
function displayRecipes(recipes) {
  recipesContain.innerHTML = "";
  recipes.forEach((item) => {
    const recipeTemplate = recipesFactory(item);
    const recipeDom = recipeTemplate.getRecipes();
    recipesContain.appendChild(recipeDom);
  });
}

displayRecipes(recipes);

function activateList(cssProperties) {
  cssProperties.classList.add("active");
}

function deactivateList(cssProperties, input, nom) {
  cssProperties.classList.remove("active");
  input.placeholder = nom;
}

function toggleArrow(type, nom, index, input) {
  if (cssProperties[index].classList.contains("active")) {
    deactivateList(cssProperties[index], input, nom);
  } else {
    activateList(cssProperties[index]);
    input.placeholder = inputsInfo[index].placeholder;

    deactivateList(inputsInfo[index].close1, inputsInfo[index].input, inputsInfo[index].name1);
    deactivateList(inputsInfo[index].close2, inputsInfo[index].input, inputsInfo[index].name2);
  }
}

/*  "toggleArrow" function toggles visibility of dropdown list and changes placeholder text of                **
**  given input element based on dropdown type. Function takes dropdown type, name, index, and                **
**  input element as inputs. If dropdown list is already active, the function deactivates it                  **
**  by calling "deactivateList" with given index and input elements                                           **
**  If dropdown list is inactive, function activates it by calling "activateList" with given index            **
**  Function then sets input element's placeholder text to corresponding values in the "inputsInfo" objects   **
**  Finally, function deactivates any other dropdown lists that are active, using "deactivateList" function   **
**  and "inputsInfo" object                                                                                   */
ingredientsToggle.addEventListener("click", (e) => {
  toggleArrow("ingrédient", "Ingrédients", 0, ingredientsSearch);
});
appareilsToggle.addEventListener("click", (e) => {
  toggleArrow("appareil", "Appareils", 1, appliancesSearch);
});
ustensilsToggle.addEventListener("click", (e) => {
  toggleArrow("ustensile", "Ustensiles", 2, utensilsSearch);
});

const inputsInfo = {
  0: {
    input: ingredientsSearch,
    placeholder: "Rechercher un Ingrédient",
    close1: cssProperties[1],
    close2: cssProperties[2],
    name1: "Ingrédients",
    name2: "ingrédients"
  },
  1: {
    input: appliancesSearch,
    placeholder: "Rechercher un Appareil",
    close1: cssProperties[0],
    close2: cssProperties[2],
    name1: "Appareils",
    name2: "appareil"
  },
  2: {
    input: utensilsSearch,
    placeholder: "Rechercher un Ustensile",
    close1: cssProperties[0],
    close2: cssProperties[1],
    name1: "Ustensiles",
    name2: "ustensile"
  },
};

/*  "ingredientsDisplay" function updates UI to display a list of unique ingredient              **
**  names based on input recipe data. The function first retrieves a list of all ingredient      ** 
**  names from input recipes, then filters and sorts this list based on the user's search term   **
**  Function finally generates HTML elements to display resulting ingredient list on the UI      */
function ingredientsDisplay(recipes) {
  let allIngredients = [];
  listIngredients.innerHTML = "";
  for (let i = 0; i < recipes.length; i++) {
    recipes[i].ingredients.forEach((i) =>
      allIngredients.push(i.ingredient.toLowerCase())
    );
  }
  let uniqueIngredients = allIngredients
    .filter((item, index) => allIngredients.indexOf(item) === index)
    .sort();

  const searchTerm = ingredientsSearch.value.trim().toLowerCase();
  const filteredIngredients = uniqueIngredients.filter((ingredient) => {
    return ingredient.includes(searchTerm);
  });

  for (let l = 0; l < filteredIngredients.length; l++) {
    listIngredients.innerHTML += `<li class="item ingredients-result" data-value='${filteredIngredients[l]}'>${filteredIngredients[l]}</li>`;
  }
}

/*  "applianceDisplay" function updates UI to display a list of unique appliance                  **
**  names based on input recipe data. The function first retrieves a list of all appliances       ** 
**  names from input recipes, then filters and sorts this list based on the user's search term    **
**  Function finally generates HTML elements to display resulting appliance list on the UI        */
function applianceDisplay(recipes) {
  let allAppliances = [];
  listAppliances.innerHTML = "";
  for (let i = 0; i < recipes.length; i++) {
    allAppliances.push(recipes[i].appliance.toLowerCase());
  }
  let uniqueAppliance = allAppliances
    .filter((item, index) => allAppliances.indexOf(item) === index)
    .sort();

  const searchTerm = appliancesSearch.value.trim().toLowerCase();
  const filteredAppliances = uniqueAppliance.filter((appliance) => {
    return appliance.includes(searchTerm);
  });

  for (let j = 0; j < filteredAppliances.length; j++) {
    listAppliances.innerHTML += `<li class="item appareils-result" data-value="${filteredAppliances[j]}" >${filteredAppliances[j]}</li>`;
  }
}

/*  "ustensilsDisplay" function updates UI to display a list of unique ustensil                  **
**  names based on input recipe data. The function first retrieves a list of all ustensils       ** 
**  names from input recipes, then filters and sorts this list based on the user's search term   **
**  Function finally generates HTML elements to display resulting ustensils list on the UI       */
function ustensilsDisplay(recipes) {
  let allUstensils = [];
  listUstensils.innerHTML = "";
  for (let k = 0; k < recipes.length; k++) {
    recipes[k].ustensils.forEach((u) => allUstensils.push(u.toLowerCase()));
  }

  let uniqueUstensils = allUstensils
    .filter((item, index) => allUstensils.indexOf(item) === index)
    .sort();

  const searchTerm = utensilsSearch.value.trim().toLowerCase();
  const filteredUstensils = uniqueUstensils.filter((ustensil) => {
    return ustensil.includes(searchTerm);
  });

  for (let l = 0; l < filteredUstensils.length; l++) {
    listUstensils.innerHTML += `<li class="item ustensils-result" data-value='${filteredUstensils[l]}'>${filteredUstensils[l]}</li>`;
  }
}


/*  "findSearch" function adds event listener to search input element, filters recipe           **
**  data based on user input, and updates UI. Function takes in several parameters, including   ** 
**  type of search, search input element, CSS classes for search results, and text to display   ** 
**  when user clears search. Filtered data is updated based on the type of search, and function ** 
**  calls other functions to update the UI based on the filtered data                           */
function findSearch(type, searchInput, cssClass, cssClose1, cssClose2, name1, name2) {
  searchInput.addEventListener("keyup", (e) => {
    activateList(cssClass);
    searchInput.placeholder = `Rechercher un ${type}`;
    let searchString = normalizeString(e.target.value.toLowerCase());
    const array = recipesFiltered.length == 0 ? recipes : recipesFiltered;
    if (searchString.length >= 3) {
      recipesFiltered = array.filter((recipe) => {
        switch(type) {
          case 'ingrédient':
            return recipe.ingredients.some((el) =>
              normalizeString(el.ingredient).includes(searchString)
            );
          case 'appliance':
            return normalizeString(recipe.appliance).includes(searchString);
          case 'ustensile':
            return recipe.ustensils.some((el) =>
              normalizeString(el).includes(searchString)
            );
        }
      });
      mediaUpdate(recipesFiltered);
      switch(type) {
        case 'ingrédient':
          ingredientsDisplay(recipesFiltered);
          break;
        case 'appliance':
          break;
        case 'ustensile':
          break;
      }
      searchInput.placeholder = `${type}s`;
    } else {
      clearSearch();
    }
    switch(type) {
      case 'ingrédient':
        deactivateList(cssClose1, appliancesSearch, name1);
        deactivateList(cssClose2, utensilsSearch, name2);
        break;
      case 'appliance':
        deactivateList(cssClose1, ingredientsSearch, name1);
        deactivateList(cssClose2, utensilsSearch, name2);
        break;
      case 'ustensile':
        deactivateList(cssClose1, ingredientsSearch, name1);
        deactivateList(cssClose2, appliancesSearch, name2);
        break;
    }
  });
}

/*  This lines call "findSearch" function for each of the three search categories:  **
**  ingredients, appliances, and ustensiles                                         **
**  Each call specifies type of search, corresponding search input elements,         **
**  and CSS classes and text to use for UI updates                                  */
findSearch('ingrédient', ingredientsSearch, cssProperties[0], cssProperties[1], cssProperties[2], "Appareils", "Ustensiles");
findSearch('appliance', appliancesSearch, cssProperties[1], cssProperties[0], cssProperties[2], "Ingrédient", "Ustensiles");
findSearch('ustensile', utensilsSearch, cssProperties[2], cssProperties[0], cssProperties[1], "Ingrédient", "Appareils");


function normalizeString(str) {
  // Normalize the string to Unicode Normalization Form C
  const NFCStr = str.normalize("NFC"); 
  // Remove all combining diacritical marks
  const strippedStr = NFCStr.replace(/[\u0300-\u036f]/g, ""); 
  // Convert all letters to lowercase
  const lowercaseStr = strippedStr.toLowerCase();
  // Replace certain ligatures and apostrophes
  const replacedStr = lowercaseStr.replace(/œ/g, "oe").replace(/æ/g, "ae").replace(/[']/g, " "); 

  return replacedStr;
}

/*  "mediaUpdate" function updates UI to display new recipe data based on given items array. **
**  Function first updates recipe cards by calling "displayRecipes" function, then updates   ** 
**  ingredient, appliance, and ustensil lists by calling their respective display functions  */
function mediaUpdate(items) {
  displayRecipes(items);
  ingredientsDisplay(items);
  applianceDisplay(items);
  ustensilsDisplay(items);
}

/*  "clearSearch" function reset current search state by emptying the "recipesFiltered" array   **
**  calling  "displayRecipes", "ingredientsDisplay", "applianceDisplay", and "ustensilsDisplay" ** 
**  functions with original "recipes" array                                                     */
function clearSearch() {
  recipesFiltered = [];
  displayRecipes(recipes);
  ingredientsDisplay(recipes);
  applianceDisplay(recipes);
  ustensilsDisplay(recipes);
}

async function init() {
  displayRecipes(recipes);
  applianceDisplay(recipes);
  ustensilsDisplay(recipes);
  ingredientsDisplay(recipes);
}
init();
