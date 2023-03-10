import { recipes } from "../data/recipes.js";
import { recipesFactory } from "./factories/recipesFactory.js";

const recipesContain = document.querySelector("#recipes-contain");

const mainFindSearch = document.getElementById('main-find');

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
let tagArrayselected = [];


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

/* "displayItems" function takes an array of items and displays list of unique        **
**  values for specified property. If property is an array of objects, it searches    ** 
**  nested property 'ingredient'. Function filters the displayed list based on a      ** 
**  search term entered in search bar associated with property.                       **
**  function updates displayed list whenever search term changes.                     **
**  function appends a unique item to list as a list item element.                    */

function displayItems(items, listElement, property) {
  let allItems = [];
  listElement.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    let currentItem = items[i][property];
    if (Array.isArray(currentItem)) {
      currentItem.forEach((c) => {
        if (typeof c === "object" && c !== null) {
          if (c.ingredient && c.ingredient.trim() !== '') {
            allItems.push(c.ingredient.toLowerCase());
          }
        } else if (c && c.trim() !== '') {
          allItems.push(c.toLowerCase());
        }
      });
    } else if (typeof currentItem === "object" && currentItem !== null) {
      if (currentItem.ingredient && currentItem.ingredient.trim() !== '') {
        allItems.push(currentItem.ingredient.toLowerCase());
      }
    } else if (currentItem && currentItem.trim() !== '') {
      allItems.push(currentItem.toLowerCase());
    }
  }
  let uniqueItems = allItems
    .filter((item, index) => allItems.indexOf(item) === index)
    .sort();

  const searchElement = document.querySelector(`#${property}-search`);
  const searchTerm = searchElement ? searchElement.value.trim().toLowerCase() : '';

  const filteredItems = uniqueItems.filter((item) => {
    return item.includes(searchTerm);
  });

  for (let j = 0; j < filteredItems.length; j++) {
    listElement.innerHTML += `<li class="item ${property}-result" data-value='${filteredItems[j]}'>${filteredItems[j]}</li>`;
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
**  Each call specifies type of search, corresponding search input elements,        **
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

/*  "addTag" function adds a selected tag to search bar and updates filters.          **
**  Function creates a new div element for selected tag, sets its class based         **
**  on tag type,and appends to search bar. deactivates corresponding result list and  **
**  updates filter by filtering recipes based on selected tag value. Finally,         **
**  "mediaUpdate" function is called to update UI with filtered recipes.              */

function addTag() {
  const ingredientsFilter = document.querySelectorAll(".ingredients-result");
  const appareilsFilter = document.querySelectorAll(".appliance-result");
  const ustensilsFilter = document.querySelectorAll(".ustensils-result");

  const addTagList = (event, nom, type, index, input) => {
    let selectedTag = event.target.innerText;
    const filterTag = document.querySelector("#find-tag");
    let selectedTagContainer = document.createElement("div");
    selectedTagContainer.innerHTML = "";
    selectedTagContainer.classList.add("" + type + "-inlinetag");
    selectedTagContainer.classList.add("active");
    selectedTagContainer.innerHTML = `<div class='items-${type}' tag'>${selectedTag}</div> <i class='far fa-times-circle close-button'></i>`;
    filterTag.appendChild(selectedTagContainer);

    deactivateList(cssProperties[index], input, nom);

    tagArrayselected.push(selectedTag);

    const array = recipesFiltered.length == 0 ? recipes : recipesFiltered;
    recipesFiltered = array.filter((recipe) => {
      switch (index) {
        case 0:
          return recipe.ingredients.some((el) => el.ingredient.toLowerCase().includes(selectedTag.toLowerCase()));
        case 1:
          return recipe.appliance.toLowerCase().includes(selectedTag.toLowerCase());
        case 2:
          return recipe.ustensils.some((el) => el.toLowerCase().includes(selectedTag.toLowerCase()));
        default:
          return false;
      }
    });

    mediaUpdate(recipesFiltered);
  };

  for (let i = 0; i < ingredientsFilter.length; i++) {
    ingredientsFilter[i].addEventListener("click", (e) => {
      addTagList(e, "Ingrédients", "ingredients", 0, ingredientsSearch);
    });
  }

  for (let i = 0; i < appareilsFilter.length; i++) {
    appareilsFilter[i].addEventListener("click", (e) => {
      addTagList(e, "Appareils", "appareils", 1, appliancesSearch);
    });
  }

  for (let i = 0; i < ustensilsFilter.length; i++) {
    ustensilsFilter[i].addEventListener("click", (e) => {
      addTagList(e, "Ustensiles", "ustensils", 2, utensilsSearch);
    });
  }
}

/* "closeTagButton" function adds a click event listener to all close   **
**  buttons of active tags. When clicked, corresponding tag is removed  ** 
**  from the search bar and the filter is updated.                      */

function closeTagButton() {
  const closeButtons = document.querySelectorAll('.close-button');
  for (let i = 0; i < closeButtons.length; i++) {
      const button = closeButtons[i];
      button.addEventListener('click', removeTag);
  }
}

function removeTag(event) {
  const tagElement = event.target.closest('.active');
  //Get type of tag (ingredients, appliances, utensils)
  tagElement.classList[0].split('-')[0];
  //Check if 'div' tag is present in active tag
  const tagValueElement = tagElement.querySelector('div');
  tagValueElement ? tagValueElement.innerText.trim().toLowerCase() : '';

  //Remove active tag
  tagElement.remove();

  
  //Get list of active ingredients, appliances, and utensils tags from their respective containers and convert them to lowercase
  const activeIngredients = Array.from(document.querySelectorAll('.ingredients-inlinetag.active div')).map(tag => tag.innerText.trim().toLowerCase());
  const activeAppliances = Array.from(document.querySelectorAll('.appareils-inlinetag.active div')).map(tag => tag.innerText.trim().toLowerCase());
  const activeUstensils = Array.from(document.querySelectorAll('.ustensils-inlinetag.active div')).map(tag => tag.innerText.trim().toLowerCase());

  //Reset filters if no tag is selected
  if (activeIngredients.length === 0 && activeAppliances.length === 0 && activeUstensils.length === 0) {
    recipesFiltered = [];
    mediaUpdate(recipes);
    return;
  }

  //Filter recipes based on remaining tags
  let newFilteredRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const ingredientsMatch = recipe.ingredients.some(el => activeIngredients.includes(normalizeString(el.ingredient)));
    const applianceMatch = activeAppliances.includes(normalizeString(recipe.appliance));
    const ustensilsMatch = recipe.ustensils.some(el => activeUstensils.includes(normalizeString(el)));

    if (ingredientsMatch || applianceMatch || ustensilsMatch) {
      newFilteredRecipes.push(recipe);
    }
  }

  //If no tag is selected, reset filters to display all recipes
  if (newFilteredRecipes.length === 0) {
    newFilteredRecipes = recipes;
  }

  recipesFiltered = newFilteredRecipes;
  mediaUpdate(recipesFiltered);
}



/*  "mediaUpdate" function updates UI to display new recipe data based on given items array. **
**  Function first updates recipe cards by calling "displayRecipes" function, then updates   ** 
**  ingredient, appliance, and ustensil lists by calling their respective display functions  */

function mediaUpdate(items) {
  displayRecipes(items);
  displayItems(items, listIngredients, 'ingredients');
  displayItems(items, listAppliances, 'appliance');
  displayItems(items, listUstensils, 'ustensils');
  addTag();
  closeTagButton();
}

/*  "clearSearch" function reset current search state by emptying the "recipesFiltered" array   **
**  calling  "displayRecipes", "ingredientsDisplay", "applianceDisplay", and "ustensilsDisplay" ** 
**  functions with original "recipes" array                                                     */

function clearSearch() {
  recipesFiltered = [];
  displayRecipes(recipes);
  displayItems(recipes, listIngredients, 'ingredients');
  displayItems(recipes, listAppliances, 'appliance');
  displayItems(recipes, listUstensils, 'ustensils');
}

/*  "init" function is called on page load and performs several actions to set up page.      **
**  function first displays all recipes, displays unique list of ingredients,                **
**  appliances, and ustensils in their respective lists. The "addTag" and "closeTagButton"   **
**  functions are called to allow users to add and remove tags to filter search results.     **
**  "mainFindSearch" element is also set to listen for keyboard input, and if the "Backspace"   **
**  key is pressed, "recipesFiltered" array is reset to the full "recipes" array and         **
**  "displayRecipes" and "mediaUpdate" functions are called to display all recipes again.    */

async function init() {
  displayRecipes(recipes);
  displayItems(recipes, listIngredients, 'ingredients');
  displayItems(recipes, listAppliances, 'appliance');
  displayItems(recipes, listUstensils, 'ustensils');
  addTag();
  closeTagButton();

  mainFindSearch.addEventListener('keyup', (e) => {
    if (e.key == 'Backspace') {
      recipesFiltered = recipes
      
      displayRecipes(recipesFiltered)
      mediaUpdate(recipesFiltered)
    }
    //Fonction de Recherche Main
  });
}
init();