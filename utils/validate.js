const validate = {
    string(target, name, empty = true) {
        if (typeof target !== 'string') throw new TypeError(`${name} ${target} is not a string`)

        if (empty && !target.trim()) throw new Error(`${name} is empty`)
    },
    minLength(target, name, minLength){
        if (target.length < minLength) throw new RangeError(`${name} ${target} must have minimum length of ${minLength} character${minLength > 1 ? 's' : ''}`)
    },
    movieType(target) {
        if (!/^[1-3]$/.test(target)) throw new Error('Invalid movie type')
    },
    number(target, name){
        if (!/^\d+$/.test(target)) throw new TypeError(`${name} ${target} is not a valid number`)
    },
}