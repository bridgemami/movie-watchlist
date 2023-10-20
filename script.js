async function fetchFilm(key, film) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${key}&s=${film}&type=movie`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function displaySearchResults(searchResults) {
  const watchlist = await getFromLocalStorage("watchlist");
  const watchlistArr = watchlist.map((info) => info.imdbID);

  const filteringIds = watchlistArr.includes(searchResults);
  if (filteringIds) {
      return "Already in Watchlist";
  } else {
      return renderMovieAsNotInWatchlist(searchResults);
  }
}

function renderMovieAsInWatchlist(movie) {
  return `<div id="${movie}">
      <p data-addimdbid="${movie}" class="icon">Already in Watchlist</p>
  </div>`;
}

function renderMovieAsNotInWatchlist(movie) {
  console.log(movie);
  return addFilmWatchlist;
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function isMovieInWatchlist(watchlist, imdbId) {
  return watchlist.some((movie) => movie.imdbID === imdbId);

}

function addFilmWatchlist() {
  let watchlistArr = getFromLocalStorage("watchlist");
  document.getElementById("search-results").addEventListener("click", function (e) {
      if (
        e.target.tagName.toLowerCase() === "i" &&
        e.target.classList.contains("fa-circle-plus")
      ) {
        const watchlistEl = document.getElementById(
          `${e.target.parentElement.id}`
        ).firstChild.nextSibling;
        const imdbId = e.target.dataset.addimdbid;
          //already in watchlist
        // if (watchlistArr.some((movie) => movie.imdbID === imdbId)) {
        //   watchlistEl.classList.remove("fa-solid", "fa-circle-plus");
        //   watchlistEl.innerHTML = "<span>Already in Watchlist</span>";
        //   console.log("Movie is already in watchlist");
        //   return;
        // }

        watchlistEl.classList.remove("fa-solid", "fa-circle-plus");
        watchlistEl.innerHTML = "<span>Added to Watchlist</span>";
        const moviesArr = getFromLocalStorage("movies")[0];
        const targetMovie = moviesArr.find((movie) => movie.imdbID === imdbId);
        if (!targetMovie) {
          console.log("Could not find target movie in moviesArr");
          return;
        }
        watchlistArr.push(targetMovie);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));
      }
    });
}

async function fetchFilmDetails(key, film) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${key}&i=${film}&type=movie`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function renderFilmList(film) {
  try {
    const filmListEl = document.getElementById("search-results");
    const exploringEl = document.getElementById("exploring");
    exploringEl.classList.add("hide");
    filmListEl.innerHTML = ``;
    if (film) {
      const detailsHtmlArray = await Promise.all(
        film.map((info) => renderFilmDetails(info.imdbID))
      );
      const html = detailsHtmlArray.join("");
      filmListEl.innerHTML = html;
      addFilmWatchlist();
    } else {
      filmListEl.classList.add("no-results");
      filmListEl.classList.remove("search-results");
      filmListEl.innerHTML = `<p>Could not find your movie, please try again</p>`;
    }
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
}

async function renderFilmDetails(id) {
  try {
    const resp = await fetchFilmDetails("ed956c7d", id);
    const data = await resp.json();
    let html = `
    <section class="film-details">
    <img src="${data.Poster}" alt="${data.Title}'s poster" class="film-poster"/>
    <div class="film-details-container">
        <h2 class="film-title">${data.Title}</h2>
      <div class="film-middle-container" id="film-middle-container">
      <div class="middle-details">
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
      <div id="${data.imdbID}">
      <i class="fa-solid fa-circle-plus icon" data-addimdbid="${
        data.imdbID}"></i>
        <span class="inner-icon">${await displaySearchResults(data.imdbID)}</span>
        </div>
    </div>
    </section>
    `;
    return html;
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
}

async function searchResults(title) {
  try {
    if (title.length > 0) {
      let res = await fetchFilm("ed956c7d", title);
      let data = await res.json();
      let results = data.Search;
      let movieArr = [results];
      await renderFilmList(results);
      localStorage.setItem("movies", JSON.stringify(movieArr));
    } else {
      const exploringEl = document.getElementById("exploring");
      exploringEl.innerHTML = `Please enter a movie in the search bar`;
      exploringEl.style.color = "black";
    }
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
}

document.getElementById("form").addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const searchFilm = document.getElementById("film-search").value;
    await searchResults(searchFilm.trim());
  } catch (err) {
    console.log(`Failed to render: ${err.message}`);
  }
});
