async function catcher(fnc) {
    return Promise
        .resolve(fnc())
        .catch(error => {
            alert(error.message)
        })
}