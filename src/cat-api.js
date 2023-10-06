import axios from "axios";

axios.defaults.headers.common["x-api-key"] =
  "live_u66nUt9TUFOwNTSSi7llvr3ZCtK1l64y8GSmpKOd2IgqopPHH4JeywM9pz8fvHeC";

export function fetchBreeds() {
  return axios.get("https://api.thecatapi.com/v1/breeds").then(response => response.data);
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response);
}
