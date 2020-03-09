async function retrieveMovie(id) {
    validate.string(id, 'movieId')

    // http://www.omdbapi.com/?apikey=422350ff&i=tt2250912

    let apiURL = `${api.endpoint}/?apikey=${api.key}&i=${id}`

    const response = await fetch(apiURL)

    if (response.status === 200) {
        const movie = await response.json()
        // { Title, Year, Poster, Ratings, Type }
        return movie || {}
    }

    return {}
}