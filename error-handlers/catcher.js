async function catcher(fnc) {
    Promise
        .resolve(fnc())
        .catch(error => {
            console.error(error)
        })
}