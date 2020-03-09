async function catcher(fnc) {
    return Promise
        .resolve(fnc())
        .catch(error => {
            console.error(error)
        })
}