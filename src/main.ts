import '@/stylus/style.styl'

export const createComponent = () => {
    const main    = document.getElementById('main')
    const element = document.createElement('h1')
    element.textContent = 'Hello, world!'
    main!.appendChild(element)
}
