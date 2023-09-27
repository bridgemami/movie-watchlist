export async function fetchFilm(key, film) {
  try {
    () => fetch(`https://www.omdbapi.com/?apikey=${key}&s=${film}&type=movie`)
  }
  catch (err) {
    console.error(err)
  }
}

