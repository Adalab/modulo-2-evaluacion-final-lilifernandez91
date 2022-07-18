'use strict';

//Obtener elementos del html y asignar a la constante
const buttonSearch = document.querySelector(`.js-button-search`);
const listContainer = document.querySelector(`.js-list-container`);
const favsContainer = document.querySelector(`.js-fav-list-container`);
const nameSerie = document.querySelector(`.js-name-serie`);

let seriesList = [];
let favorites = [];

//Función manejadora del evento Search
const handleSearch = (event) => {
    event.preventDefault();
    search(nameSerie.value);
}

//El botón escucha el evento click y ejecuta la función handleSearch
buttonSearch.addEventListener(`click`, handleSearch);

//Obtener datos del servidor
const search = (nameTextSerie) => {
    fetch(`https://api.jikan.moe/v4/anime?q=${nameTextSerie}`)
        .then((response) => response.json())
        .then((data) => {
            seriesList = data.data;
            console.log(seriesList)

            listContainer.innerHTML = '';

            //Iterar listado de series
            for (const serie of seriesList) {
                const favoriteFoundIndex = favorites.findIndex((fav) => serie.mal_id === fav.mal_id);
                const isFavorite = favoriteFoundIndex !== -1;
                getCard(serie, isFavorite);
            }
        });
}


//Función manejadora del evento Favorite
const handleFavorite = (event) => {
    event.preventDefault();
    const idSelected = parseInt(event.currentTarget.id);

    const serieFound = seriesList.find((serie) => serie.mal_id === idSelected);

    if (serieFound) {
        document.getElementById(serieFound.mal_id).classList.toggle('favorite')

        const favoriteFound = favorites.findIndex((fav) => fav.mal_id === serieFound.mal_id);

        if (favoriteFound === -1) {
            favorites.push(serieFound);
        } else {
            favorites.splice(favoriteFound, 1);
        }

        favsContainer.innerHTML = '';

        for (const favorite of favorites) {
            getCardForFavorite(favorite);
        }
    }
    console.log(favorites);
}

//Función para pintar una serie
const getCard = (serie, fav) => {

    const divContainerColors = document.createElement("div");
    divContainerColors.setAttribute(`class`, `colors`);
    if (fav) {
        divContainerColors.setAttribute(`class`, `favorite`);
    }
    divContainerColors.setAttribute(`id`, serie.mal_id);

    const divContainer = document.createElement("div");
    divContainer.setAttribute(`class`, `series`);

    const title = document.createElement("h3");
    title.setAttribute('class', 'title');
    const titleText = document.createTextNode(serie.title);
    title.appendChild(titleText);
    divContainer.appendChild(title);

    const image = document.createElement("img");
    image.setAttribute('class', 'image');
    image.setAttribute('src', serie.images.jpg.image_url);
    image.setAttribute('alt', `imagen de ${serie.title}`);
    divContainer.appendChild(image);

    divContainerColors.appendChild(divContainer);
    listContainer.appendChild(divContainerColors);

    //El div de la imagen escuche el evento click y ejecuta la función handleFavorite
    divContainerColors.addEventListener(`click`, handleFavorite)
}


//Función para pintar una serie
const getCardForFavorite = (serie) => {

    const divContainerColors = document.createElement("div");
    divContainerColors.setAttribute(`class`, `colors`);
    divContainerColors.setAttribute(`class`, `favorite`);

    const divContainer = document.createElement("div");
    divContainer.setAttribute(`class`, `series`);

    const title = document.createElement("h3");
    title.setAttribute('class', 'title');
    const titleText = document.createTextNode(serie.title);
    title.appendChild(titleText);
    divContainer.appendChild(title);

    const image = document.createElement("img");
    image.setAttribute('class', 'image');
    image.setAttribute('src', serie.images.jpg.image_url);
    image.setAttribute('alt', `imagen de ${serie.title}`);
    divContainer.appendChild(image);

    divContainerColors.appendChild(divContainer);
    favsContainer.appendChild(divContainerColors);

}