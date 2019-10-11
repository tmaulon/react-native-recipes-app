const API_TOKEN = "e55b468eef032e9c10c7f385cf40d16f";

export function getFilmsFromApiWithSearchedText(text, page) {
  const url =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    API_TOKEN +
    "&language=fr&query=" +
    text +
    "&page=" +
    page;

  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error(error));
}

export function getFilmDetailFromApi(id) {
  const url =
    "https://api.themoviedb.org/3/movie/" +
    id +
    "?api_key=" +
    API_TOKEN +
    "&language=fr";

  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error(error));
}

// API/TMDBApi.js

export function getImageFromApi(name) {
  return "https://image.tmdb.org/t/p/w300" + name;
}
