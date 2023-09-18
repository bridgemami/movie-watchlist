function fetchFilm(key, film) {
  return fetch(`http://www.omdbapi.com/?apikey=${key}&s=${film}&type=movie`);
}

function fetchFilmDetails(key, film) {
  return fetch(`http://www.omdbapi.com/?apikey=${key}&i=${film}&type=movie`);
}

async function renderFilmList(film) {
  try {
    const filmListEl = document.getElementById("search-results");
    const exploringEl = document.getElementById("exploring");
    exploringEl.classList.add("hide");
    const detailsHtmlArray = await Promise.all(film.map(info => renderFilmDetails(info.imdbID)));
    const html = detailsHtmlArray.join('');
    filmListEl.innerHTML = html;
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
}

async function renderFilmDetails(id) {
  try {
    const resp = await fetchFilmDetails("ed956c7d", id);
    const data = await resp.json();
    console.log(data);
    let html = `
    <section class="film-details">
    <img src="${data.Poster}" alt="${data.title}'s poster" class="film-poster"/>
    <div class="film-details-container">
        <h2 class="film-title">${data.Title}</h2>
      <div class="film-middle-container">
      <div  class="middle-details">
      <p>${data.Runtime}</p>
      <p>${data.Genre}</p>
      </div>
      <p class="plot">${data.Plot}</p>
      </div>
      <div class="film-bottom-container">
      <div>
      <i class="fa-solid fa-star star"></i>
      <span>${data.imdbRating}</span>
      </div>
      <div id="add">
      <i class="fa-solid fa-circle-plus"></i>
      <span class="watchlist">Watchlist</span>
      </div>
      </div>
    </div>
    </section>
    `
    return html
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
}

async function searchResults(title) {
  try {
    let res = await fetchFilm("ed956c7d", title);
    let data = await res.json();
    let results = data.Search;
    await renderFilmList(results);
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
}

document.querySelector("#form").addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    let searchFilm = document.querySelector("#film-search").value;
    await searchResults(searchFilm.trim());
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
});
