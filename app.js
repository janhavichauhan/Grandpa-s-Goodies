
// Wait for DOM to load before fully executing the code
document.addEventListener('DOMContentLoaded', function () {
    // Selecting elements from DOM
    const toggle = document.querySelector('.toggle');
    const links = document.querySelector('.links');
    const FoodContainer = document.getElementById('food-container');
    const Reflect = document.getElementById('reflect');
    const Enter = document.getElementById('enter-btn');
    const ColumnFood = document.getElementById('FOOD');
    const FoodDetails = document.querySelector('.food-recipe');
    const quotes = document.getElementsByClassName('quotes')[0];
    const CloseButton = document.querySelector('.closebutton');

    // Event listener for toggling the navigation links
    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
    });

    // Display a random quote
    let quote = [
        "A recipe has no soul. You as the cook must bring soul to the recipe.",
        "Cooking is the art of adjustment.",
        "Cooking is the art of passion.",
        "Cooking is the art of living.",
        "Cooking is at once children's play and adult joy. And cooking done with care is an act of love.",
        "Cooking is like love. It should be entered into with abandon or not at all.",
        "Boo-hoo, I ain’t sharing my desserts!",
        "Don’t go breaking promises; break pie crusts instead.",
        "Everyone has their own poison. Mine happens to be sugar.",
        "If the saying 'we are what we eat' is true, I must be impressively sweet."
    ];
    quotes.innerText = quote[Math.floor(Math.random() * quote.length)];

    // API URL for fetching random food
    const API = "https://www.themealdb.com/api/json/v1/1/random.php?";

    // Fetch random food
    fetch(API)
        .then(response => response.json())
        .then(content => {
            const food = content.meals[0];

            // Display food image
            const image = document.createElement("img");
            image.setAttribute("src", food.strMealThumb);
            image.alt = food.strMeal;

            // Display food name
            const nameOfFood = document.getElementById("name");
            nameOfFood.innerText = food.strMeal;

            // Append image to the food container
            FoodContainer.innerHTML = '';
            FoodContainer.append(image);

            // Create and display ingredients
            const container = document.createElement("div");
            container.className = "ingredients-div";

            const header = document.createElement("h3");
            header.innerHTML = `INGREDIENTS <span class="Close" >&#10060</span>`;
            
            container.append(header);

            // Event listener for closing the ingredients display
            header.querySelector('.Close').addEventListener('click', () => {
                Reflect.style.display ='none';
            });
            
            // Loop through ingredients and append to the container
            for (let i = 1; i <= 20; i++) {
                const ingredientName = `strIngredient${i}`;
                const value = food[ingredientName];

                if (value) {
                    const ingredientParagraph = document.createElement("p");
                    ingredientParagraph.innerText = value;
                    container.append(ingredientParagraph);
                }
            }

            // Append ingredients to the reflect
            Reflect.innerHTML = '';
            Reflect.append(container);

            // Display reflect on image click
            image.onclick = () => {
                Reflect.style.display = "inherit";
            };
        })
        .catch(error => {
            console.error("Error fetching food:", error);
            FoodContainer.innerHTML = '';
            Reflect.innerHTML = '';
        });

    // Event listeners
    Enter.addEventListener('click', getMeals);
    ColumnFood.addEventListener('click', getRecipe);
    CloseButton.addEventListener('click', () => {
        FoodDetails.parentElement.classList.remove('showRecipe');
    });

    // Function to fetch meals based on user input
    function getMeals() {
        let enterInput = document.getElementById('input');
        if (enterInput) {
            let inputValue = enterInput.value.trim();
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputValue}`)
                .then(response => response.json())
                .then(content => {
                    let html = "";
                    if (content.meals) {
                        content.meals.forEach(meal => {
                            html += `
                                <div class="item" data-id="${meal.idMeal}">
                                    <div class="photo">
                                        <img src="${meal.strMealThumb}" alt="food">
                                    </div>
                                    <div class="nam">
                                        <h3>${meal.strMeal}</h3>
                                        <a  href="#" class="recipe-btn">Recipe</a>
                                    </div>
                                </div>
                            `;
                        });
                        ColumnFood.classList.remove('notFound');
                    } else {
                        html = "Sorry, search doesn't match";
                        ColumnFood.classList.add('noFood');
                    }

                    ColumnFood.innerHTML = html;
                })
                .catch(error => console.error('Error fetching meals:', error));
        } else {
            console.error("Element with ID 'input' not found.");
        }
    }

    // Function to get the recipe details
    function getRecipe(e){
        e.preventDefault();
        if(e.target.classList.contains('recipe-btn')){
            e.target.innerText = 'Scroll Down';
            let mealItem = e.target.parentElement.parentElement;
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => modal(data.meals));
        }
    }

    // Function to display the recipe details in a modal
    function modal(meal) {
        console.log(meal);
        meal = meal[0];
        let html = `
            <h2 class="headings">${meal.strMeal}</h2>
            <p class="Category">${meal.strCategory}</p>
            <div class="instruction">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="food_image">
                <img src="${meal.strMealThumb}" alt="">
            </div>
            <div class="link_of_recipe">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
            </div>
        `;
        FoodDetails.innerHTML = html;
        FoodDetails.parentElement.classList.add('showRecipe');
    }
});
