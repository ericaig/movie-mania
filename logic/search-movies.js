async function searchMovies(query, type = '', year = '') {
    validate.string(query, 'search query')
    validate.minLength(query, 'query', 1)
    if (type.trim()) validate.movieType(type)
    if (year.trim()){
        validate.number(year, 'year')
        // validate.maxDigits(year, 'year', 4)
    }

    let apiURL = `${api.endpoint}/?apikey=${api.key}&s=${query}`
    const movieTypes = ['movie', 'series', 'episode']

    if (type.trim()) apiURL = `${apiURL}&type=${movieTypes[type - 1]}`
    if (year.trim()) apiURL = `${apiURL}&year=${year}`

    const response = await fetch(apiURL)

    if (response.status === 200) {
        const { Search } = await response.json()
        return Search || []
    }

    return []
}