import { fetchBreeds, fetchCatByBreed } from "./cat-api.js";
import Notiflix from "notiflix";
import SlimSelect from "slim-select";

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
  refs.list.style.display = "block";
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
      <h2>${breedName}</h2>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Temperament:</strong> ${temperament}</p>
      <img src="${imageUrl}" width="100%" height="auto" alt="${breedName}" />
        `;
}
