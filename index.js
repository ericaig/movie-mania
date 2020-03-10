/** Class to perform movies search queries */
class MovieMania {
    searchRequestActivated = false
    
    // PS: for now, reordering only supports a single option at a time 
    reorderConfig = { Title: 'desc' }
    results = []

    /**
     * @function 
     * Helps to create a node attribute which can be latter applied on a DOM element
     * @param {string} attr Attribute of an element to create (e.g class, id, name, data, data-type,...)
     * @param {string} value Value of the newly created attribute
     * @returns {Attr} The newly created node attribute
     */
    createAttributeNode(attr, value) {
        const nodeAttr = document.createAttribute(attr)
        nodeAttr.value = value
        return nodeAttr
    }

    /**
     * @function
     * Creates a new HTML Element
     * @param {string} tagName Name of the element to create
     * @param {string} classString Classes to assign to the newly created element. No class is assigned if it's undefined
     * @param {string} content Content of the newly created element. Will be empty if it's undefined
     * @returns {HTMLElement} The newly created HTML Element
     */
    createNodeElement(tagName, classString, content) {
        const { createAttributeNode } = this

        const el = document.createElement(tagName)
        if (typeof classString !== "undefined") el.setAttributeNode(createAttributeNode('class', classString))

        if (typeof content !== "undefined") el.innerHTML = content

        return el
    }

    /**
     * @function
     * Closes modal used for viewing movies details
     */
    closeModal() {
        const Modal = document.querySelector('.Modal')
        Modal.classList.remove('show')
        const body = document.querySelector('body')
        body.classList.remove('hasModal')
        const ModalContent = document.querySelector('.Modal-Content')
        ModalContent.innerHTML = ''
    }

    /**
     * @function
     * Opens modal used for viewing movies details
     */
    showModal() {
        const body = document.querySelector('body')
        body.classList.add('hasModal')
        const Modal = document.querySelector('.Modal')
        Modal.style.top = `${document.documentElement.scrollTop + 50}px`
        Modal.classList.add('show')

        const ModalBackdrop = document.querySelector('.Modal-Backdrop')
        ModalBackdrop.style.top = `${document.documentElement.scrollTop}px`

        
        const closeBtn = document.querySelector('.modal__close')
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault()
            this.closeModal()
        })
    }

    /**
     * @function
     * Generates the content of 'Movie Modal'
     * @param {object} movie Object containing a movie's information
     * @param {string} movie.imdbID Movie's ID
     * @param {string} movie.Title Movie's title
     * @param {string} movie.Year Movie's production year
     * @param {string} movie.Poster Movie's poster image
     * @param {[{Source: string, Value: string}] } movie.Ratings Movie's ratings
     * @param {array} movie.Ratings Movie's ratings
     * @param {string} movie.Type Movie's type
     * @param {string} movie.Plot A brief summary of what the movie is about
     * @returns {string} Modal content
     */
    createModalContent({ imdbID, Title, Year, Poster, Ratings, Type, Plot }){
        let ratingItems = ''
        Ratings.forEach(({ Source, Value }) => ratingItems += `<li class="Rating">
                <section class="Ratings-Source">${Source}</section>
                <section class="Ratings-Score">${Value}</section>
            </li>` )

        return `
        <section class="Modal-Content">
            <section class="Modal-Main">
                <section class="Modal-Poster">
                    <img src="${Poster}" alt="${Title}"/>
                </section>
                <section class="Modal-Details">
                    <h1 class="Modal-Title">${Title}</h1>
                    <hr class="divider" />
                    <p class="Modal-Description">${Plot}</p>
                    <h4 class="Ratings-Title">Ratings</h4>
                    <ul class="Ratings">${ratingItems}</ul>
                    <section class="Modal-Tags">
                        <span class="Modal-Tag">${Year}</span>
                        <span class="Modal-Tag">${Type}</span>
                    </section>
                    <div class="Modal-Link">
                        <a title="Opens a new tab" href="https://www.imdb.com/title/${imdbID}/" target="_blank">https://www.imdb.com/title/${imdbID}/</a>
                    </div>
                    <div class="Modal-Link">
                        <a class="modal__close" href="/">Close</a>
                    </div>
                </section>
            </section>
        </section>
        `
    }

    /**
     * Fetches a movie's details using the id param and calls the ```createModalContent()``` function when done
     * @param {string} id Required to fetch movie's details
     * @returns {Promise<void>}
     */
    async handleMovieDetails(id) {
        const modal = document.querySelector('.Modal')
        
        const movie = await catcher(async () => await retrieveMovie(id))
        modal.innerHTML = movie ? this.createModalContent(movie) : 'Movie not found'
        this.showModal()
    }

    /**
     * @function
     * Appends node elements to DOM after looping through movie search results
     */
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

            movie.addEventListener('click', () => this.handleMovieDetails(imdbID))
        }
    }

    /**
     * @function
     * Reorders search movies in ascending or descending order depending on the current value of ```reorderConfig```. Calls ```outputSearchResult()``` when done
     */
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


    /**
     * @function
     * Executes ```searchMovies()``` logic to return Movies array
     * @param {string} query Search param required to execute search API
     * @param {string} type Type of movie
     * @param {string} year Movie's production year
     */
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

    /**
     * @function
     * Assigns ```submit``` event listener to searchbar form and calls ```handleSearch()``` with form values
     */
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

    /**
     * Toggles the current reorder option and changes from descending to ascending and vice versa. It also assure that we have just a single reorder option in the ```reorderConfig``` variable as reordering only supports a single option at a time for now
     * @param {string} option Specifies reorder option. Value can be ```Title | Year```.
     * @returns Current reordering direction ```asc | desc```
     */
    toggleReorderOption(option) {
        const { reorderConfig } = this

        const currentValue = reorderConfig[option]
        reorderConfig[option] = currentValue === 'asc' ? 'desc' : 'asc'

        //this allows us to always have the current option as the only value in reorderConfig object
        Object.keys(reorderConfig).forEach(item => { (option !== item && (delete reorderConfig[item])) })

        return reorderConfig[option]
    }

    /**
     * @function
     * Updates reorder buttons' icon according to reorder direction
     */
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

    /**
     * @function
     * Assigns click event listener to reorder buttons. This gives them the functinoality of being able to reorder search result
     */
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

    /**
     * @function
     * Initializes first level callbacks
     */
    init() {
        this.handleFormSubmitSearch()
        this.handleReorderItemClick()
        this.renderReorderElementsIcons()

        // this.handleSearch('spider')

        const Modal = document.querySelector('.Modal-Backdrop')
        Modal.addEventListener('click', () => this.closeModal())
    }
}

/**
 * @event
 * Instantiates and initializes ```MovieMania()``` class after DOM has fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    const movieMania = new MovieMania()
    movieMania.init()
}, false)