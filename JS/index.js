/// <reference types="../@types/jquery" />

// ======================> Loading <======================
$(function () {
    $('.loader').fadeOut('slow', function () {
        $('.spinner-area').slideUp('slow', function () {
            $('.spinner-area').remove()
            $('body').css('overflow', 'auto')
        })
    })
})

// ======================> sideBar <======================

let sideBarWidth = $('.side-list').outerWidth();
$('.side-bar').css('left', `-${sideBarWidth}`)
$('#openSideBar').on('click', function () {
    $('.side-bar').animate({ left: `0` }, 500, function () {
        $('.side-list li').animate({top : `0%`},400)
    })
    $('#openSideBar').toggleClass('d-none');
    $('#closeSideBar').toggleClass('d-none');
})
$('#closeSideBar').on('click', function () {
    $('.side-bar').animate({ left: `-${sideBarWidth}` }, 500, function () {
        $('.side-list li').animate({top : `100%`},100)
    });
    $('#openSideBar').toggleClass('d-none');
    $('#closeSideBar').toggleClass('d-none');
})

// ======================> main-Page <======================
let mainPage = document.getElementById('mainPage');
let meals = [];

async function getMainData() {
    let getData = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    let receiveData = await getData.json();
    meals = receiveData.meals;
    displayMeals()
}

async function displayMeals() {
    let cartouna = ``;
    for (let i = 0; i < meals.length; i++) {
        cartouna += `
        <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
            <div class="item position-relative overflow-hidden">
                    <img src="${meals[i].strMealThumb}" class="w-100" alt="">
                    <div
                        class="item-layer position-absolute d-flex flex-column justify-content-center align-items-center">
                        <h3>${meals[i].strMeal}</h3>
                    </div>
            </div>
        </div>
        `
    }
    document.getElementById('mainDisplay').innerHTML = cartouna;
    $('.item').on('click', async function (e) {
        let currentMeal = e.currentTarget.innerText;
        let currentMealId = await getId(`${currentMeal}`);
        getMealDetail(currentMealId)
        $('#mainPage').toggleClass('d-none')
        $('#mealDetails').toggleClass('d-none')
    })
}

if (mainPage) {
    getMainData()
}

async function getId(mealName) {
    let mealId;
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    let receiveData = await getData.json();
    mealId = receiveData.meals;
    return mealId[0].idMeal;
}
async function getMealDetail(id) {
    let details = [];
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let receiveData = await getData.json();
    details = receiveData.meals;
    console.log(id);
    console.log();

    let mealRecipes = [];
    let mealTags;
    for (let i = 1; i < 20; i++) {
        if (details[0][`strMeasure${i}`] !== " " && details[0][`strIngredient${i}`] !== "") {
            mealRecipes.push(`<li class="recipe mx-2 my-1">${details[0][`strMeasure${i}`] + ' ' + details[0][`strIngredient${i}`]}</li>`)
        }

    }
        mealTags = details[0].strTags.split(',')

    let cartouna = ``;
    for (let i = 0; i < details.length; i++) {
        cartouna += `
                <div class="col-sm-12 col-md-6">
                    <img src="${details[i].strMealThumb}" class="w-75" alt="">
                    <h2>${details[i].strMeal}</h2>
                </div>
                <div class="col-sm-12 col-md-6">
                    <h2>Instructions</h2>
                    <p>${details[i].strInstructions}</p>
                    <h3>Area: ${details[i].strArea}</h3>
                    <h3>Caregory: ${details[i].strCategory}</h3>
                    <h3>Recipes:</h3>
                    <ul class="d-flex flex-wrap">
                        ${mealRecipes.join(' ')}
                    </ul>
                    <h3>Tags:</h3>
                    <ul class="d-flex">
                        <li class="tag mx-2">${mealTags[0]}</li>
                        <li class="tag mx-2">${mealTags[1]}</li>
                    </ul>
                    </ul>
                    <div class="btns-group d-flex">
                        <button type="button" class="btn btn-success mx-2"><a href=${details[i].strSource}>Source</a></button>
                        <button type="button" class="btn btn-danger mx-2"><a href=${details[i].strYoutube}>Youtube</a></button>
                    </div>
                </div>
        `
    }
    document.getElementById('detailDisplay').innerHTML = cartouna;
}

// ======================> categories-Page <======================

let categoriesPage = document.getElementById('categoriesPage');
let mealDetails = document.getElementById('mealDetails');
let categories = [];

// Get data from API
async function getCatData() {
    let getData = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    let receiveData = await getData.json();
    categories = receiveData.categories;
    // Call Display function
    displayCategories()
}
// function display the meals of the specific category
async function filterByCat(name) {
    let filtered = [];
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
    let receiveData = await getData.json();
    filtered = receiveData.meals;
    let cartouna = ``;
    for (let i = 0; i < filtered.length; i++) {
        cartouna += `
            <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
                <div class="cat-item position-relative overflow-hidden">
                    <img src="${filtered[i].strMealThumb}" class="w-100" alt="">
                    <div class="cat-item-layer overflow-hidden position-absolute text-center d-flex flex-column justify-content-center px-2">
                        <h3 class="text-black">${filtered[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `
    }
    document.getElementById('catDisplay').innerHTML = cartouna;
    $('.cat-item').on('click', async function (e) {
        let currentMeal = e.currentTarget.innerText;
        let currentMealId;
        currentMealId = await getId(currentMeal);
        getMealDetail(currentMealId);
        $('#categoriesPage').toggleClass('d-none')
        $('#mealDetails').toggleClass('d-none')
    })
}
// function that display the Meal Details
function displayCategories() {
    let cartouna = ``;
    for (let i = 0; i < categories.length; i++) {
        cartouna += `
            <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
                <div class="cat-item position-relative overflow-hidden">
                    <img src="${categories[i].strCategoryThumb}" class="w-100" alt="">
                    <div class="cat-item-layer overflow-hidden position-absolute text-center d-flex flex-column justify-content-center px-2">
                        <h3 class="text-black">${categories[i].strCategory}</h3>
                        <p class="text-black">${categories[i].strCategoryDescription.split(' ').slice(0, 20).join(' ')}</p>
                    </div>
                </div>
            </div>
        `
    }
    document.getElementById('catDisplay').innerHTML = cartouna;
    $('.cat-item').on('click', function (e) {
        // we Can use DOM Traversing from currentTarget
        filterByCat(e.currentTarget.querySelector('h3').innerText);
    })
}

if (categoriesPage) {
    getCatData()
}

// ======================> Area-Page <======================

let areaPage = document.getElementById('areaPage');
let areas = [];
let areaMeals = [];
async function getAreaData() {
    let getData = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    let receiveData = await getData.json();
    areas = receiveData.meals;
    displayAreas()
}

function displayAreas() {
    let cartouna = ``;
    for (let i = 0; i < areas.length; i++) {
        cartouna += `
            <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
                    <div class="area d-flex flex-column align-items-center">
                        <i class="fa-solid fa-house-laptop fa-4x text-white mb-2"></i>
                        <h3 class="text-white">${areas[i].strArea}</h3>
                    </div>
                </div>
        `
    }
    document.getElementById('areaDisplay').innerHTML = cartouna;
    $('.area').on('click', async function (e) {
        let currentArea = e.currentTarget.innerText;
        getAreaMeals(currentArea);
    })
}

async function getAreaMeals(area) {
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let receiveData = await getData.json();
    areaMeals = receiveData.meals;
    console.log(areaMeals);
    displayAreaMeals()
}

async function displayAreaMeals() {
    let cartouna = ``;
    for (let i = 0; i < areaMeals.length; i++) {
        cartouna += `
        <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
            <div class="item position-relative overflow-hidden">
                    <img src="${areaMeals[i].strMealThumb}" class="w-100" alt="">
                    <div
                        class="item-layer position-absolute d-flex flex-column justify-content-center align-items-center">
                        <h3>${areaMeals[i].strMeal}</h3>
                    </div>
            </div>
        </div>
        `
    }
    document.getElementById('areaDisplay').innerHTML = cartouna;
    $('.item').on('click', async function (e) {
        let currentMeal = e.currentTarget.innerText;
        let currentMealId = await getId(`${currentMeal}`);
        getMealDetail(currentMealId)
        $('#areaPage').toggleClass('d-none')
        $('#mealDetails').toggleClass('d-none')
    })
}

if (areaPage) {
    getAreaData()
}

// ======================> Ingredients-Page <======================

let ingredientsPage = document.getElementById('ingredientsPage');
let ingreds = [];
let ingredsMeals = [];

async function getIngredsData() {
    let getData = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    let receiveData = await getData.json();
    ingreds = receiveData.meals;
    displayIngreds()
}

function displayIngreds() {
    let cartouna = ``;
    for (let i = 0; i < ingreds.length; i++) {
        if (ingreds[i].strDescription != null && ingreds[i].strDescription != "") {
            cartouna += `
            <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
                    <div class="ingred text-center d-flex flex-column align-items-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x text-white mb-2"></i>
                        <h3 class="text-white">${ingreds[i].strIngredient}</h3>
                        <p class="text-white">${ingreds[i].strDescription.split(' ').slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        `
        }
    }
    document.getElementById('ingredientsDisplay').innerHTML = cartouna;
    $('.ingred').on('click', async function (e) {
        let currentMeal = e.currentTarget.querySelector('h3').innerText;
        console.log(currentMeal);
        getIngredMeals(currentMeal)
    })
}

async function getIngredMeals(ingred) {
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingred}`);
    let receiveData = await getData.json();
    ingredsMeals = receiveData.meals;
    console.log(ingredsMeals);
    displayIngredMeals()
}

async function displayIngredMeals() {
    let cartouna = ``;
    for (let i = 0; i < ingredsMeals.length; i++) {
        cartouna += `
        <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
            <div class="item position-relative overflow-hidden">
                    <img src="${ingredsMeals[i].strMealThumb}" class="w-100" alt="">
                    <div
                        class="item-layer position-absolute d-flex flex-column justify-content-center align-items-center">
                        <h3>${ingredsMeals[i].strMeal}</h3>
                    </div>
            </div>
        </div>
        `
    }
    document.getElementById('ingredientsDisplay').innerHTML = cartouna;
    $('.item').on('click', async function (e) {
        let currentMeal = e.currentTarget.innerText;
        let currentMealId = await getId(`${currentMeal}`);
        getMealDetail(currentMealId)
        $('#ingredientsPage').toggleClass('d-none')
        $('#mealDetails').toggleClass('d-none')
    })
}

if (ingredientsPage) {
    getIngredsData()
}

// ======================> Search-Page <======================
let searchPage = document.getElementById('searchPage');
let searchName = document.getElementById('searchName');
let searchLetter = document.getElementById('searchLetter');

$(searchName).on('input', function () {
    searchByName(searchName.value)
})
async function searchByName(name) {
    let searchResult = [];
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let receiveData = await getData.json();
    searchResult = receiveData.meals;
    displaySearchResult(searchResult)
}
$(searchLetter).on('input', function () {
    if (searchLetter.value != null || searchLetter.value != '') {
        searchByLetter(searchLetter.value)
    }
})
async function searchByLetter(letter) {
    let searchResult = [];
    let getData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let receiveData = await getData.json();
    searchResult = receiveData.meals;
    displaySearchResult(searchResult)

}

async function displaySearchResult(searchResult) {
    let cartouna = ``;
    for (let i = 0; i < searchResult.length; i++) {
        cartouna += `
        <div class="col-sm-12 col-md-4 col-lg-3 mt-3">
            <div class="item position-relative overflow-hidden">
                    <img src="${searchResult[i].strMealThumb}" class="w-100" alt="">
                    <div
                        class="item-layer position-absolute d-flex flex-column justify-content-center align-items-center text-center">
                        <h3>${searchResult[i].strMeal}</h3>
                    </div>
            </div>
        </div>
        `
    }
    document.getElementById('searchRow').innerHTML = cartouna;
    $('.item').on('click', async function (e) {
        let currentMeal = e.currentTarget.innerText;
        let currentMealId = await getId(`${currentMeal}`);
        getMealDetail(currentMealId)
        $('#searchPage').toggleClass('d-none')
        $('#mealDetails').toggleClass('d-none')
    })
}
// ======================> Contact-Page <======================



if (location.pathname.endsWith("/Contact-Us.html")) {

    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let password = document.getElementById('password');
    let repassword = document.getElementById('repassword');
    let submitBtn = document.getElementById('submitBtn');

    let regex = {
        nameRegex: /^[a-zA-Z\s]{2,}$/,
        emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phoneRegex: /^(010|011|012|015)[0-9]{8}$/,
        passwordRegex: /^[a-zA-Z0-9]{6,}$/,
    }
    let validation = function () {
        if (regex.nameRegex.test(name.value) == true && regex.emailRegex.test(email.value) == true && regex.phoneRegex.test(phone.value) == true && regex.passwordRegex.test(password.value) == true && password.value == repassword.value) {
            return true;
        }
        else {
            return false
        }
    }
    // =============>> Error
    // |=> we use event 'input' to be live with enterd values
    $('input').on(" input", function () {
        if (validation() == true) {
            $(submitBtn).removeAttr('disabled');
        }
        if (validation() == false) {
            $(submitBtn).attr('disabled', true);
        }
    })
}


