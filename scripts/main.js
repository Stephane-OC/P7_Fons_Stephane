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
let recipesFiltered = recipes;

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

/*                                    PARAMETERS                                        **
**  items: an array of objects representing items to be displayed in list (recipe ingredients, appliances or ustensils)        **
**  listElement: DOM elements containing list where items will be displayed (listIngredients, listAppliances or listUstensils) **
**  property: property of item object used to display its value ('ingredients', 'appliances', or 'ustensils')                  */

function displayItems(items, listElement, property) {
  let allItems = [];
  listElement.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    let currentItem = items[i][property];
    if (Array.isArray(currentItem)) {
      currentItem.forEach((c) => {
        if (typeof c === "object" && c !== null) {
          if (c.ingredient && c.ingredient.trim() !== "") {
            allItems.push(c.ingredient.toLowerCase());
          }
        } else if (c && c.trim() !== "") {
          allItems.push(c.toLowerCase());
        }
      });
    } else if (typeof currentItem === "object" && currentItem !== null) {
      if (currentItem.ingredient && currentItem.ingredient.trim() !== "") {
        allItems.push(currentItem.ingredient.toLowerCase());
      }
    } else if (currentItem && currentItem.trim() !== "") {
      allItems.push(currentItem.toLowerCase());
    }
  }
  let uniqueItems = allItems
    .filter((item, index) => allItems.indexOf(item) === index)
    .sort();

  const searchElement = document.querySelector(`#${property}-search`);
  const searchTerm = searchElement
    ? searchElement.value.trim().toLowerCase()
    : "";

  const filteredItems = uniqueItems.filter((item) => {
    return item.includes(searchTerm);
  });

  for (let j = 0; j < filteredItems.length; j++) {
    // Create a new li element using createElement
    const liElement = document.createElement("li");

    // Add necessary classes and attributes to li element
    liElement.classList.add("item", `${property}-result`);
    liElement.dataset.value = filteredItems[j];
    liElement.textContent = filteredItems[j];

    // Append li element to listElement using appendChild
    listElement.appendChild(liElement);
  }
}

/*  "closeOtherLists" function closes all other lists that are not currently in focus.  **
**  function takes current list, current input, and placeholder text as                 **
**  arguments, and iterates through all other lists, deactivating them if they          **
**  are not current list.                                                               **
**                                                                                      **
**                                    PARAMETERS                                        **
**  currentList: DOM element of list that is currently in focus                         */

function closeOtherLists(currentList) {
  const otherLists = document.querySelectorAll('.advanced-find');

  otherLists.forEach((list) => {
    const listInput = list.querySelector('input');
    const listPlaceholder = listInput.getAttribute('placeholder');
    if (list !== currentList) {
      deactivateList(list, listInput, listPlaceholder);
    }
  });
}


/*  "findSearch" function handles  search and filtering of dropdown lists.        **
**  Function takes inputElement, listElement, itemClass, and placeholder as       **
**  parameters. It adds 'input' and 'focus' event listeners to inputElement.      **
**  On'input' event, it normalizes input value, closes other lists, activates     **
**  current list, and filters items based on normalized input value.              **
**  On 'focus' event, it closes other lists and activates current list.           **
**  function works for ingredients, appliances, and ustensils dropdown lists.     */

/*                                    PARAMETERS                                  **
**  inputElement: input field DOM element for search                              **
**  listElement: DOM element containing list of items to filter                   **
**  itemClass: CSS class name for each item in list                               **
**  placeholder: placeholder text for input field                                 */

function findSearch(inputElement, listElement, itemClass, placeholder) {
  inputElement.addEventListener('input', (event) => {
    const filterText = normalizeString(event.target.value);
    closeOtherLists(inputElement.parentElement.parentElement, inputElement, placeholder);
    activateList(inputElement.parentElement.parentElement);

    const items = listElement.querySelectorAll(itemClass);
    items.forEach((item) => {
      const itemValue = normalizeString(item.getAttribute('data-value'));
      if (itemValue.includes(filterText)) {
        item.style.display = 'list-item';
      } else {
        item.style.display = 'none';
      }
    });
  });

  inputElement.addEventListener('focus', (event) => {
    closeOtherLists(inputElement.parentElement.parentElement, inputElement, placeholder);
    activateList(inputElement.parentElement.parentElement);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  findSearch(ingredientsSearch, listIngredients, '.ingredients-result', 'Ingrédients');
  findSearch(appliancesSearch, listAppliances, '.appliance-result', 'Appareils');
  findSearch(utensilsSearch, listUstensils, '.ustensils-result', 'Ustensiles');
});

function normalizeString(str) {
  // Normalize strings to Unicode Normalization Form D (NFD)
  const NFDStr = str.normalize("NFD");
  // Remove all combining diacritical marks
  const strippedStr = NFDStr.replace(/[\u0300-\u036f]/g, "");
  // Convert all letters to lowercase
  const lowercaseStr = strippedStr.toLowerCase();
  // Replace certain ligatures and apostrophes
  const replacedStr = lowercaseStr.replace(/œ/g, "oe").replace(/æ/g, "ae").replace(/[']/g, " ");

  return replacedStr;
}


/* "addTag" function adds selected tag to search bar and updates filters.               **
** Function creates a new div element for selected tag and sets its class based         **
** on tag type. It checks if tag already exists, and if it does, it doesn't add it      **
** again. Then, it appends tag to search bar, deactivates the corresponding             **
** result list, and updates the filter by filtering recipes based on selected tag value.**
** Finally, it resets input value and placeholder and calls the "tagManager" function.  */

function addTag() {
  const ingredientsFilter = document.querySelectorAll(".ingredients-result");
  const appareilsFilter = document.querySelectorAll(".appliance-result");
  const ustensilsFilter = document.querySelectorAll(".ustensils-result");

  const addTagList = (event, nom, type, index, input) => {
    let selectedTag = event.target.innerText;
  
    // Check if the tag already exists
    const existingTag = document.querySelector(
      `.${type}-inlinetag .items-${type}[data-tag-value="${selectedTag}"]`
    );
    // If the tag exists, do not add it again
    if (existingTag) {
      return;
    }
    const dropdownItem = document.querySelector(
      `[data-value="${selectedTag.toLowerCase().trim()}"]:not(.disabled)`
    );
    if (!dropdownItem) {
      return;
    }
    dropdownItem.classList.add("disabled");
    const filterTag = document.querySelector("#find-tag");
    let selectedTagContainer = document.createElement("div");
    selectedTagContainer.innerHTML = "";
    selectedTagContainer.classList.add("" + type + "-inlinetag");
    selectedTagContainer.classList.add("active");
    // Create necessary elements
    const itemDiv = document.createElement("div");
    const closeButton = document.createElement("i");
  
    // Add necessary classes and attributes to each element
    itemDiv.className = `items-${type}`;
    itemDiv.textContent = selectedTag;
    itemDiv.setAttribute("data-tag-value", selectedTag); // Add data attribute
  
    closeButton.className = "far fa-times-circle close-button";
  
    // Add created elements to selectedTagContainer
    selectedTagContainer.appendChild(itemDiv);
    selectedTagContainer.appendChild(closeButton);
    filterTag.appendChild(selectedTagContainer);
  
    deactivateList(cssProperties[index], input, nom);
    console.log(
      "Tag clicked:",
      event.target.innerText,
      "Filtered recipes:",
      recipesFiltered
    );
    closeTagButton();
  
    // Reset input value and placeholder
    input.value = "";
    input.placeholder = nom;
    tagManager();
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

/*  The "removeTag" function is called when a user clicks on an active tag to remove it.   **
**  It first identifies clicked tag element and removes it from active tags.               **
**  Then, it calls the "tagManager" function to filter recipes based on remaining tags.    **
**  It also calls the "mainSearchBarFilter" and "mediaUpdate" functions to update display  **
**  accordingly, reflecting changes in active tags.                                        */

function removeTag(event) {
  const tagElement = event.target.closest('.active');
  
  // Remove active tag
  tagElement.remove();

  // Call tagManager to filter recipes based on remaining tags and update the displayed recipes
  tagManager();
  mainSearchBarFilter();
  mediaUpdate(recipesFiltered);
}


/*  tagManager" function is called to manage filtering of recipes based on active             **
**  tags selected by users. It retrieves active ingredients, appliances, and ustensils        **
**  tags and filters recipes based on these tags. If there are no active tags and no search   **
**  string, function resets filters to original recipe list. After filtering                  **
**  recipes, it updates displayed recipes by calling "mediaUpdate" function with              **
**  the filtered list.                                                                        */

function tagManager() {
  const activeIngredients = Array.from(
    document.querySelectorAll(".ingredients-inlinetag.active .items-ingredients")
  ).map((tag) => tag.innerText.trim().toLowerCase());
  const activeAppliances = Array.from(
    document.querySelectorAll(".appareils-inlinetag.active .items-appareils")
  ).map((tag) => tag.innerText.trim().toLowerCase());
  const activeUstensils = Array.from(
    document.querySelectorAll(".ustensils-inlinetag.active .items-ustensils")
  ).map((tag) => tag.innerText.trim().toLowerCase());

  const searchString = mainFindSearch.value.toLowerCase().trim();

  // Reset filters if no tag is selected and there is no search string
  if (
    activeIngredients.length === 0 &&
    activeAppliances.length === 0 &&
    activeUstensils.length === 0
  ) {
    if (searchString.length === 0 || searchString.length >= 3) {
      recipesFiltered = recipes;
      mediaUpdate(recipesFiltered);
      displayRecipes(recipesFiltered);
    }
    return;
  }

  // Filter recipes based on remaining tags and search string
  recipesFiltered = recipes.filter((recipe) => {
    const ingredientsMatch =
      activeIngredients.length === 0 ||
      recipe.ingredients.some((el) =>
        activeIngredients.includes(el.ingredient.toLowerCase().trim())
      );
    const applianceMatch =
      activeAppliances.length === 0 ||
      activeAppliances.includes(recipe.appliance.toLowerCase().trim());
    const ustensilsMatch =
      activeUstensils.length === 0 ||
      recipe.ustensils.some((el) =>
        activeUstensils.includes(el.toLowerCase().trim())
      );
    const searchMatch =
      searchString.length === 0 ||
      searchString.length < 3 ||
      recipe.name.toLowerCase().includes(searchString) ||
      recipe.description.toLowerCase().includes(searchString) ||
      recipe.ingredients.some((el) =>
        el.ingredient.toLowerCase().includes(searchString)
      );
    return ingredientsMatch && applianceMatch && ustensilsMatch && searchMatch;
  });

  // Display the number of recipes after filtering by tag
  console.log("Nombre de recettes après filtrage par tag:", recipesFiltered.length);

  mediaUpdate(recipesFiltered);
  displayRecipes(recipesFiltered);
}

/* "mainSearchBarFilter" function filters and displays recipes based on main search input value. **
** It uses searchString to filter recipes by their name, ingredients, and description.           **
** It then updates the UI with the filtered recipes and shows a message if no recipes are found. */

function mainSearchBarFilter() {
  const searchString = normalizeString(mainFindSearch.value.toLowerCase());
  console.log("searchString:", searchString);

  const searchMessage = document.getElementById("searchMessage");

  // Clear the recipes container
  recipesContain.innerHTML = "";

  // Filter recipes based on the main search string
  const searchFilteredRecipes = recipesFiltered.filter((recipe) => {
    const { name, ingredients, description } = recipe;
    // Check if recipe name, description or ingredients match search string
    const nameMatchesSearch = normalizeString(name)
      .toLowerCase()
      .includes(searchString);
    const descriptionMatchesSearch = normalizeString(description)
      .toLowerCase()
      .includes(searchString);
    const ingredientMatchesSearch = ingredients.some((ingredient) =>
      normalizeString(ingredient.ingredient)
        .toLowerCase()
        .includes(searchString)
    );

    return nameMatchesSearch || descriptionMatchesSearch || ingredientMatchesSearch;
  });

  // Display the filtered recipes in real-time
  searchFilteredRecipes.forEach((filteredRecipe) => {
    const recipeTemplate = recipesFactory(filteredRecipe);
    const recipeDom = recipeTemplate.getRecipes();
    recipesContain.appendChild(recipeDom);
  });

  recipesFiltered = searchFilteredRecipes;
  console.log("NB recettes après filtrage par recherche:", recipesFiltered.length);
  if (searchString.length < 3) {
    searchMessage.style.display = "none";
    tagManager();
    return;
  }

  if (searchFilteredRecipes.length == 0) {
    searchMessage.textContent = "Aucune recette ne correspond à votre critère, veuillez réessayer...";
    searchMessage.style.display = "block";
  } else {
    searchMessage.style.display = "none";
  }
}

/*  "mediaUpdate" function updates UI to display new recipe data based on given items array. **
**  Function first updates recipe cards by calling "displayRecipes" function, then updates   ** 
**  ingredient, appliance, and ustensil lists by calling their respective display functions  */

function mediaUpdate(items) {
  displayItems(items, listIngredients, 'ingredients');
  displayItems(items, listAppliances, 'appliance');
  displayItems(items, listUstensils, 'ustensils');
  addTag();
}
/*  "init" function is called on page load and performs several actions to set up page.       **
**  function first displays all recipes, displays unique list of ingredients,                 **
**  appliances, and ustensils in their respective lists. The "addTag" and "closeTagButton"    **
**  functions are called to allow users to add and remove tags to filter search results.      **
**  "mainFindSearch" element is also set to listen for keyboard input, and if the "Backspace" **
**  key is pressed, "recipesFiltered" array is reset to the full "recipes" array and          **
**  "displayRecipes" and "mediaUpdate" functions are called to display all recipes again.     */

let debounceTimer;
async function init() {
  displayRecipes(recipes);
  displayItems(recipes, listIngredients, "ingredients");
  displayItems(recipes, listAppliances, "appliance");
  displayItems(recipes, listUstensils, "ustensils");
  addTag();

  mainFindSearch.addEventListener("keyup", (e) => {
    const searchString = mainFindSearch.value.toLowerCase().trim();

    if (searchString.length > 0 && searchString.length < 3) {
      searchMessage.textContent = "Veuillez entrer au moins 3 caractères pour commencer à lancer une recherche.";
      searchMessage.style.display = "block";
      console.log("Search string too short.");
      
      if (e.key === "Backspace" && searchString.length == 2) {
        recipesFiltered = recipes;
        tagManager();
        mediaUpdate(recipesFiltered);
        displayRecipes(recipesFiltered);
        console.log("Moins de 3 caractère et Backspace")
      }
    } else {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchMessage.style.display = "none";
        if (e.key === "Backspace") {
          recipesFiltered = recipes;
          tagManager();
          console.log("Plus de 3 caractère et Backspace")
        }
        mainSearchBarFilter();
        displayRecipes(recipesFiltered);
        mediaUpdate(recipesFiltered);
      }, 300);
    }
  });
}
init();

