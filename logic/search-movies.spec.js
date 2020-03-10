describe('searchMovies', () => {
    it('should succeed on retrieving movies according to search parametres', async () => {
        const query = 'spider'
        const movies = await searchMovies(query)
        expect(movies).toBeInstanceOf(Array)
        
        movies.forEach(({ Title, Poster, Year, imdbID, Type }) => {
            expect(typeof Title).toBe('string')
            expect(typeof Poster).toBe('string')
            expect(typeof Year).toBe('string')
            expect(typeof imdbID).toBe('string')
            expect(typeof Type).toBe('string')
        });
    })

    it('should succeed return empty array if no movie is found', async () => {
        const query = 'this_search_param_should_yield_empty'
        const movies = await searchMovies(query)
        expect(movies).toBeInstanceOf(Array)
        expect(movies.length).toBe(0)
    })

    // it('should fail if type parametre is invalid', async () => {
    //     const query = 'spider'
    //     const type = ''
    //     const movies = await searchMovies(query)
    //     expect(movies).toBeInstanceOf(Array)
    //     expect(movies.length).toBe(0)
    // })

    it('should fail on non string query parametre', async () => {
        const name = 'search query'
        let target

        target = 1234
        await searchMovies(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = false
        await searchMovies(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = []
        await searchMovies(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = {}
        await searchMovies(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = undefined
        await searchMovies(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })
    })

    it('should fail if given type parametre is invalid', async () => {
        const name = 'type'
        let target

        target = true
        await searchMovies('spider', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = false
        await searchMovies('spider', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = "type"
        await searchMovies('spider', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof Error).toBe(true)
            expect(error.message).toBe('Invalid movie type')
        })

        target = "900"
        await searchMovies('spider', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof Error).toBe(true)
            expect(error.message).toBe('Invalid movie type')
        })
    })

    it('should fail if given year parametre is invalid', async () => {
        const name = 'year'
        let target

        target = true
        await searchMovies('spider', '1', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = false
        await searchMovies('spider', '1', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = "type"
        await searchMovies('spider', '1', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a valid number`)
        })

        target = "%&/()"
        await searchMovies('spider', '1', target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a valid number`)
        })
    })
})