class Textures {
    // loads and stores the graphical textures/sprites
    body = document.querySelector("body")
    createSvg(figure, color) {
        const object = document.createElement('object')
        object.type = 'image/svg+xml'
        object.data = `assets/svg/${figure}-${color}.svg`
        object.className = "figure"
        this.body.append(object)
        return object
    }

    getSvgScr(figure, colorChar) {
        return `/front/assets/svg/${figure.toUpperCase()}-${colorChar}.svg`
    }
}