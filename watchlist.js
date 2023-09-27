const watchlistEl = document.getElementById("watchlist");

async function fetchFilmDetails(key, film) {
    try{
    const response = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${film}&type=movie`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response
  }
  catch(err) {
    console.error(err);
    throw err;
  }
  }
async function creatingWatchlist() {
  let watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
console.log(watchlistArr);
console.log(watchlistArr.length);

  if (watchlistArr.length === 0) {
    watchlistEl.innerHTML = ` 
    <div class= "empty-list-container">
    <p>Your watchlist is looking a little empty...</p>
        <a href="./index.html" class="blank-list">
          <div class="blank-list">
            <i class="fa-solid fa-circle-plus icon"></i>
            <span>Let's add some movies!</span>
          </div>
        </a>
        </div>`;
} 

else {
    findingFilmInformation(watchlistArr)
}
}
async function findingFilmInformation(arr) {
  console.log(arr)
        try {
             const detailsHtmlArray = await Promise.all(
                arr.map(
                  (info) =>  renderWatchlist(info.imdbID))
             ); 
             removeFilm(arr)
            const html = detailsHtmlArray.join("");
            watchlistEl.innerHTML += html;
          } catch (err) {
            console.log(`Failed to render: ${err.message}`);
          }
  }


  async function renderWatchlist(id) {
    try {
        // console.log(id);
        const resp = await fetchFilmDetails("ed956c7d", id);
        const data = await resp.json();
       //console.log(data);
        let html = `
        <section class="film-details">
        <img src="${data.Poster}" alt="${data.title}'s poster" class="film-poster"/>
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
          <i class="fa-solid fa-circle-minus icon" data-removeimdbid="${data.imdbID}"></i>
          <span>Remove Watchlist</span>
          </div>
        </div>
        </section>
        `;
        return html;
      } catch (err) {
        console.log(`Failed to render: ${err.message}`);
      }
    }
    function removeFilm() {
      document.getElementById("watchlist").addEventListener("click", function (e) {
        if (e.target.tagName.toLowerCase() === "i" && e.target.classList.contains("fa-circle-minus")) {
          let watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
            const targetFilm = watchlistArr.filter(film => film.imdbID === e.target.parentElement.id)[0];
  
          watchlistArr = watchlistArr.filter(film => film.imdbID !== targetFilm.imdbID);
  
          localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
  
          e.target.closest(".film-details").remove();
  
          if (watchlistArr.length === 0) {
              watchlistEl.innerHTML = ` 
              <p>Your watchlist is looking a little empty...</p>
                  <a href="./index.html" class="blank-list">
                  <div class="blank-list">
                  <i class="fa-solid fa-circle-plus icon"></i>
                  <span>Let's add some movies!</span>
                  </div>
              </a>`;
          }
        }
      });
  }
  
  creatingWatchlist()