import { fetchBreeds, fetchCatByBreed } from "./cat-api.js";
import Notiflix from "notiflix";
//import SlimSelect from "slim-select";

const refs = {
  options: document.querySelector(".breed-select"),
  list: document.querySelector(".cat-info"),
  loader: document.querySelector(".loader"),
  error: document.querySelector(".error"),
};


function showLoader() {
  refs.loader.style.display = "block";
  refs.options.style.display = "none";
  refs.list.style.display = "none";
  refs.error.style.display = "none";
}

function hideLoader() {
  refs.loader.style.display = "none";
  refs.options.style.display = "block";
  refs.list.style.display = "flex";
}

function showError() {
    const errorMessage = refs.error.textContent;
    Notiflix.Notify.failure(errorMessage);
}

showLoader();

fetchBreeds()
  .then(data => {
    refs.options.insertAdjacentHTML("beforeend", createMarkupOptions(data));
  })
  .catch(err => {
    console.log(err);
    refs.loader.style.display = "none";
    showError();
  })
  .finally(() => hideLoader());

refs.options.addEventListener("change", handleSearch);

function handleSearch(event) {
  showLoader();
  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      const catInfo = {
        breedName: data.data[0].breeds[0].name,
        description: data.data[0].breeds[0].description,
        temperament: data.data[0].breeds[0].temperament,
        imageUrl: data.data[0].url,
      };

      refs.list.innerHTML = createMarkupList(catInfo);
    })
    .catch(err => {
      console.log(err);
      hideLoader();
      showError();
    })
    .finally(() => hideLoader());
}

function createMarkupOptions(arr) {
  return arr
    .map(
      ({ id, name }) => `
        <option value="${id}">${name}</option>
      `,
    )
    .join("");
}

function createMarkupList({ breedName, description, temperament, imageUrl }) {
  return `
    <div class="cat-info-photo">
      <img src="${imageUrl}" alt="${breedName}"  width="600"/>
    </div>
    <div class="cat-info-container">
      <h2 class="cat-info-title">${breedName}</h2>
      <p class="cat-info-text">Description: <span>${description}</span></p>
      <p class="cat-info-text">Temperament: <span>${temperament}.</span></p>
    </div>
        `;
}
