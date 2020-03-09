class MovieMania {
    searchRequestActivated = false
    // PS: for now, reordering only supports a single option at a time 
    reorderConfig = { Title: 'desc' }
    results = []

    createAttributeNode(attr, value) {
        const nodeAttr = document.createAttribute(attr)
        nodeAttr.value = value
        return nodeAttr
    }

    createNodeElement(tagName, classString, content) {
        const { createAttributeNode } = this

        const el = document.createElement(tagName)
        if (typeof classString !== "undefined") el.setAttributeNode(createAttributeNode('class', classString))

        if (typeof content !== "undefined") el.innerHTML = content

        return el
    }

    closePopover() {
        const popover = document.querySelector('.Popover')
        popover.classList.remove('show')
        const body = document.querySelector('body')
        body.classList.remove('hasPopover')
        const popoverContent = document.querySelector('.Popover-Content')
        popoverContent.innerHTML = ''
    }

    showPopover(){
        const body = document.querySelector('body')
        body.classList.add('hasPopover')
        const popover = document.querySelector('.Popover')
        popover.style.top = `${document.documentElement.scrollTop + 50}px`
        popover.classList.add('show')
        
        const popoverBackdrop = document.querySelector('.Popover-Backdrop')
        popoverBackdrop.style.top = `${document.documentElement.scrollTop}px`
    }

    async fetchMovieDetails(id){
        const result = await catcher(async () => await retrieveMovie(id))
        console.log(result)
    }

    handleMovieDetails(id, event) {
        this.showPopover()
        // const popoverContent = document.querySelector('.Popover-Content')
        // popoverContent.innerHTML = id

        this.fetchMovieDetails(id)
        console.log(id)
    }

    outputSearchResult() {
        const movies = document.querySelector('.Movies')

        if (!this.results.length) {
            const query = document.querySelector('.Searchbar-Form input[name=query]').value
            movies.innerHTML = `No result for "${query}"`
            return
        }

        movies.innerHTML = ''

        // self.results.forEach(({ Title, Poster, Year, imdbID, Type }) => {
        for (const result of this.results) {
            const { Title, Poster, Year, imdbID, Type } = result
            const poster = this.createNodeElement('img', 'Movie-Poster')
            poster.setAttributeNode(this.createAttributeNode('alt', Title))
            poster.src = Poster

            const movieDetails = this.createNodeElement('section', 'Movie-Details')
            const movieTitle = this.createNodeElement('h1', 'Movie-Title', Title)
            const hrDivider = this.createNodeElement('hr', 'divider')

            const tags = this.createNodeElement('section', 'Movie-Tags')
            tags.append(this.createNodeElement('span', 'Movie-Tag', Year), ' ')
            tags.append(this.createNodeElement('span', 'Movie-Tag', Type.toUpperCase()))

            movieDetails.append(movieTitle, hrDivider, tags)


            const movie = this.createNodeElement('li', 'Movie')
            movie.append(poster, movieDetails)

            movies.append(movie)

            movie.addEventListener('click', (event) => this.handleMovieDetails(imdbID, event))
        }
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

    handleSearch(query, type, year) {
        if (!this.searchRequestActivated) {
            this.searchRequestActivated = true

                ; (async () => {
                    await catcher(async () => {
                        this.results = await searchMovies(query, type, year)
                        this.reorderAndOutputResultsToUI()
                    })

                    this.searchRequestActivated = false
                })()
        } else {
            console.log('Please wait, searching for results for ' + query)
        }
    }

    handleFormSubmitSearch() {
        const form = document.querySelector('.Searchbar .Searchbar-Form')

        form.addEventListener('submit', event => {
            event.preventDefault()

            const {
                target: {
                    query: { value: query },
                    type: { value: type },
                    year: { value: year },
                }
            } = event

            this.handleSearch(query, type, year)
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
        this.handleFormSubmitSearch()
        this.handleReorderItemClick()
        this.renderReorderElementsIcons()

        this.handleSearch('spider')

        this.showPopover()

        const popover = document.querySelector('.Popover-Backdrop')
        popover.addEventListener('click', () => this.closePopover())
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const movieMania = new MovieMania()
    movieMania.init()
}, false)