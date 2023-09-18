 async function fetchFilm (key, film) {
    return fetch(
      `http://www.omdbapi.com/?apikey=${key}&t=${film}`
    )
};

// async function renderSearchResults (title) {
// try {
//     let res =  await fetchFilm('ed956c7d', title)
//     let data = await res.json()
//     console.log(data)
// }

// catch {
//     (err) => console.log(`Failed to render: ${err.message}`)
// }
// }
export default fetchFilm