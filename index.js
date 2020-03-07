class MovieMania {
    searchRequestActivated = false

    createNodeElement(tagName, classString, content) {
        const el = document.createElement(tagName)

        if (typeof classString !== "undefined") {
            const elClass = document.createAttribute("class")
            elClass.value = classString
            el.setAttributeNode(elClass)
        }

        if (typeof content !== "undefined") el.innerHTML = content

        return el
    }

    outputSearchResult(results) {
        const resultsUl = document.querySelector('ul.results')

        if (!results.length) {
            const query = document.querySelector('form.search input[name=query]').value
            resultsUl.innerHTML = `No result for "${query}"`
            return
        }

        resultsUl.innerHTML = ''

        results.forEach(({ Title, Poster, Year, imdbID, Type }) => {
            const poster = this.createNodeElement('img')
            poster.src = Poster

            const item = this.createNodeElement('li', 'search__result--item', Title)
            item.append(poster)

            resultsUl.append(item)
        })
    }

    handleSearch() {
        const form = document.querySelector('.Searchbar .Searchbar-Form')

        form.addEventListener('submit', event => {
            event.preventDefault()

            const {
                target: {
                    query: { value: _query },
                    type: { value: _type },
                    year: { value: _year },
                }
            } = event

            if (!this.searchRequestActivated) {
                this.searchRequestActivated = true

                ;(async() => {
                    await catcher(async() => {
                        const results = await searchMovies(_query, _type, _year)
                        this.outputSearchResult(results) 
                        console.log(results)
                    })

                    this.searchRequestActivated = false
                })()
            } else {
                console.log('Please wait, searching for results for ' + _query)
            }
        })
    }

    init() {
        this.handleSearch()
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const movieMania = new MovieMania()
    movieMania.init()
}, false)