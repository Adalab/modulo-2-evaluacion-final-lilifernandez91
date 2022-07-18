'use strict';

//Obtener elementos del html y asignar a la constante
const buttonSearch = document.querySelector(`.js-button-search`);
const listContainer = document.querySelector(`.js-list-container`);
const favsContainer = document.querySelector(`.js-fav-list-container`);
const nameSerie = document.querySelector(`.js-name-serie`);
const resetItem = document.querySelector(`.js-reset-item`);

let seriesList = [];
let favorites = [];

//Función manejadora del evento Search
const handleSearch = (event) => {
    event.preventDefault();
    search(nameSerie.value);
};

//Función manejadora del evento Search
const handleReset = (event) => {
    event.preventDefault();
    nameSerie.value = '';
    search('');
};

//El botón escucha el evento click y ejecuta la función handleSearch
buttonSearch.addEventListener(`click`, handleSearch);
resetItem.addEventListener(`click`, handleReset);

//Obtener datos del servidor
const search = (nameTextSerie) => {
    fetch(`https://api.jikan.moe/v4/anime?q=${nameTextSerie}`)
        .then((response) => response.json())
        .then((data) => {
            seriesList = data.data;

            // obtener los favoritos desde el local storage
            getFavoritesFromLocalStorage();

            // llamar a la funcion para renderizar los resultados (las series)
            renderResultList();

            renderFavorites();
        });
};

const renderFavorites = () => {
    favsContainer.innerHTML = '';

    for (const favorite of favorites) {
        favsContainer.innerHTML += getHtmlForCard(favorite, false, false);
    }

    setTimeout(() => {
        for (const favorite of favorites) {
            const closeIconFavorite = document.getElementById(`close-favorite-${favorite.mal_id}`);

            closeIconFavorite.addEventListener('click', removeFavorite);
        }
    }, 100);



    if (favorites && favorites.length > 0) {
        favsContainer.innerHTML += `<button class="reset-favorites" id="reset-favorites">Reset favorites</button>`

        const favoriteBtn = document.getElementById('reset-favorites');
        favoriteBtn.addEventListener('click', handleResetFavorites);
    }
}

const handleResetFavorites = () => {
    // reset favorites removing elements from favorites list and from local storage
    favorites = [];
    localStorage.setItem('favorites', JSON.stringify([]));

    renderResultList();
    renderFavorites();
}

const removeFavorite = (event) => {
    const idFavorite = parseInt(event.target.id.split('close-favorite-')[1]);

    favorites = favorites.filter(x => x.mal_id !== idFavorite);

    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderResultList();
    renderFavorites();
}

//Función para pintar una serie
const getHtmlForCard = (serie, isSerieList, isFavorite) => {

    const htmlForCard = `
    <div class="colors${isFavorite ? ' favorite' : ''}" id="${isSerieList ? '' : 'favorite-'}${serie.mal_id}">
        <div class="series">
            <h3 class="title">${serie.title}</h3>
            <img class="image" src="${serie.images.jpg.image_url}" alt="imagen de ${serie.title}">
        </div>
        ${isSerieList ? '' : `<i class="fa-solid fa-xmark close-favorite-icon" id="close-favorite-${serie.mal_id}"></i>`}
        
    </div>
    `;
    return htmlForCard;
};

const renderResultList = () => {
    // clean results div in case we have old series
    listContainer.innerHTML = '';

    //Iterar listado de series para renderizarla en la pantalla
    for (const serie of seriesList) {

        // para cada serie verificar si ya está en nuestra lista de favoritos
        const favoriteFoundIndex = favorites.findIndex((fav) => serie.mal_id === fav.mal_id);

        // si el índice es distinto de -1 es que no está en la lista
        const isFavorite = favoriteFoundIndex !== -1;

        // obtener el html para cada serie
        listContainer.innerHTML += getHtmlForCard(serie, true, isFavorite);
    }

    // iterar el listado de series para agregarle el eventListener para manejar los favoritos

    for (const serie of seriesList) {
        const divCurrentSerie = document.getElementById(serie.mal_id);
        divCurrentSerie.addEventListener('click', handleFavorite);
    }
}

//Función manejadora del evento Favorite
const handleFavorite = (event) => {

    event.preventDefault();
    const idSelected = parseInt(event.currentTarget.id);

    const serieFound = seriesList.find((serie) => serie.mal_id === idSelected);

    if (serieFound) {
        document.getElementById(serieFound.mal_id).classList.toggle('favorite')

        // ver si el favorito ya está agregado a la lista
        const favoriteFound = favorites.findIndex((fav) => fav.mal_id === serieFound.mal_id);

        // si se obtiene -1 es que no está y lo agregamos, caso contrario lo eliminamos de la lista.
        if (favoriteFound === -1) {
            favorites.push(serieFound);
        } else {
            favorites.splice(favoriteFound, 1);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));

        renderFavorites();
    }
}

const getFavoritesFromLocalStorage = () => {
    let favoritesListFromLocalStorage = JSON.parse(localStorage.getItem('favorites'));

    if (favoritesListFromLocalStorage) {
        favorites = favoritesListFromLocalStorage
    } else {
        favorites = [];
    }
}