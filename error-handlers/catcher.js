async function catcher(fnc) {
    Promise
        .resolve(fnc())
        .catch(({ message }) => {
            console.error(message)
        })
}