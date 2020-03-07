class MovieMania {
    searchRequestActivated = false
    // PS: for now, reordering only supports a single option at a time 
    reorderConfig = { Title: 'desc' }
    results = []

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

    outputSearchResult() {
        const { results, createNodeElement } = this
        const resultsUl = document.querySelector('.Results')

        if (!results.length) {
            const query = document.querySelector('.Searchbar-Form input[name=query]').value
            resultsUl.innerHTML = `No result for "${query}"`
            return
        }

        resultsUl.innerHTML = ''

        results.forEach(({ Title, Poster, Year, imdbID, Type }) => {
            const poster = createNodeElement('img')
            poster.src = Poster

            const item = createNodeElement('li', 'search__result--item', `${Title} - ${Year}`)
            item.append(poster)

            resultsUl.append(item)
        })
    }

    reorderAndOutputResultsToUI() {
        const { results, reorderConfig } = this
        // there should only be 1 key in reorderConfig, so let's get the first one
        const [option] = Object.keys(reorderConfig)
        const directions = (() => {
            const response = []
            response.push(reorderConfig[option] === 'asc' ? 1 : -1)
            response.push(response[0] === -1 ? 1 : -1)
            return response
        })()

        if (option) {
            results.sort((a, b) => {
                // https://stackoverflow.com/a/42478664
                const [greaterThanValue, lessThanValue] = directions
                if (a[option] !== b[option]) {
                    return a[option] < b[option] ? greaterThanValue : lessThanValue
                }
                return 0
            })
        }


        this.outputSearchResult()
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

                    ; (async () => {
                        await catcher(async () => {
                            this.results = await searchMovies(_query, _type, _year)
                            this.reorderAndOutputResultsToUI()
                        })

                        this.searchRequestActivated = false
                    })()
            } else {
                console.log('Please wait, searching for results for ' + _query)
            }
        })
    }

    toggleReorderOption(option) {
        const { reorderConfig } = this

        const currentValue = reorderConfig[option]
        reorderConfig[option] = currentValue === 'asc' ? 'desc' : 'asc'

        //this allows us to always have the current option as the only value in reorderConfig object
        Object.keys(reorderConfig).forEach(item => { (option !== item && (delete reorderConfig[item])) })

        return reorderConfig[option]
    }

    renderReorderElementsIcons() {
        document.querySelectorAll('.ReorderItems .ReorderItem')
            .forEach(item => {
                const option = item.getAttribute('data-reorder-opt')
                item.classList.remove('ascending', 'descending')
                if (option in this.reorderConfig) {
                    item.classList.add(`${this.reorderConfig[option]}ending`)
                }
            })
    }

    handleReorderItemClick() {
        document.querySelectorAll('.ReorderItems .ReorderItem')
            .forEach(item =>
                item.addEventListener('click', (event) => {
                    const { target: element } = event
                    const option = element.getAttribute('data-reorder-opt')
                    const orderDirection = this.toggleReorderOption(option)

                    if (orderDirection) {
                        this.reorderAndOutputResultsToUI()
                        this.renderReorderElementsIcons()
                        element.classList.remove('ascending', 'descending')
                        element.classList.add(`${orderDirection}ending`)
                    }
                })
            )
    }

    init() {
        this.handleSearch()
        this.handleReorderItemClick()
        this.renderReorderElementsIcons()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const movieMania = new MovieMania()
    movieMania.init()
}, false)