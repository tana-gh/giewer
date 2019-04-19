import { appendAce } from './ace'

export const createComponent = (selector: string) => {
    const targets = document.querySelectorAll(selector)
    targets.forEach(x => appendAce(x))
}
