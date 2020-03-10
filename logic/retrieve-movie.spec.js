describe('retrieveMovie', () => {
    it('should succeed on retrieving a movie with a valid id', async () => {
        const movieId = 'tt4154796'
        const movie = await retrieveMovie(movieId)
        expect(movie).toBeDefined()
        expect(movie).toBeInstanceOf(Object)
        expect(Object.keys(movie).length > 0).toBe(true)
        expect(movie.imdbID).toBe(movieId)
        expect(typeof movie.Title).toBe('string')
        expect(typeof movie.Type).toBe('string')
        expect(typeof movie.Year).toBe('string')
        expect(movie.Ratings).toBeInstanceOf(Array)
    })

    it('should fail on retrieving a movie with an invalid id', async () => {
        const movieId = 'invalid--id'

        retrieveMovie(movieId).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof Error).toBe(true)
            expect(error.message).toBe('Incorrect IMDb ID.')
        })
    })

    it('should fail on non string id parametre', async () => {
        const name = 'movieId'
        let target

        target = 1234
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = false
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = []
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = {}
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })

        target = undefined
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof TypeError).toBe(true)
            expect(error.message).toBe(`${name} ${target} is not a string`)
        })
    })

    it('should fail if id parametre is empty', async () => {
        const name = 'movieId'
        let target

        target = ''
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof Error).toBe(true)
            expect(error.message).toBe(`${name} is empty`)
        })

        target = ' '
        await retrieveMovie(target).then(() => {
            expect(true).toBe(false) // shouldn't execute this
        }).catch(error => {
            expect(error).toBeDefined()
            expect(error instanceof Error).toBe(true)
            expect(error.message).toBe(`${name} is empty`)
        })
    })
})