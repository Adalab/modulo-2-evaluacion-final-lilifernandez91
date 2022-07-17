'use strict';

//Obtener elementos del html y asignar a la constante
const buttonSearch = document.querySelector(`.js-button-search`);
const listContainer = document.querySelector(`.js-list-container`);
const nameSerie = document.querySelector(`.js-name-serie`);

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
            const searchData = data.data;
            console.log(searchData)

            listContainer.innerHTML = '';

            //Iterar listado de series
            for (const serie of searchData) {
                getCard(serie);
            }
        });
}

//Función manejadora del evento Favorite
//const handleFavorite = (event) => {
//event.preventDefault();
//}

//Función para dibujar una serie
const getCard = (serie) => {

    const divContainerColors = document.createElement("div");
    divContainerColors.setAttribute(`class`, `colors`);

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
    //divContainerColors.addEventListener(`click`, handleFavorite)
}