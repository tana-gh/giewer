import * as Ace  from './ace'
import * as Gist from '../utils/gist'
import * as Log  from '../utils/log'
import * as Urls from '../utils/urls'
import * as C    from '../utils/constants'

export const initComponents = (selector: string): void => {
    const targets = document.querySelectorAll(selector)
    targets.forEach(async el => await initOneComponent(<HTMLElement>el))
}

const initOneComponent = async (el: HTMLElement) => {
    await bindAceToElement(el)
    
    if (!el.classList.contains(C.aceEditorClass)) {
        Log.error('Failed to bind ace editor.')
        return
    }

    const service = el.dataset.service

    if (!service) {
        insertText(el, `'data-service' attribute not found.\n`)
        return
    }

    let content: string | undefined

    if (service === C.services.github) {
        content = await initGithub(el)
    }
    else if (service === C.services.gist) {
        content = await initGist(el)
    }
    else {
        insertText(el, 'Invalid service name.\n')
        return
    }

    if (content !== undefined) insertText(el, content)
}

const bindAceToElement = async (el: HTMLElement) => {
    let mode = el.dataset.mode
    if (mode === '') mode = undefined

    if (mode !== undefined && !Urls.isModeKey(mode)) {
        Log.error(`Invalid mode ${mode}.\n`)
        return
    }

    let theme = el.dataset.theme
    if (theme === '') theme = undefined
    
    if (theme !== undefined && !Urls.isThemeKey(theme)) {
        Log.error(`Invalid theme ${theme}.\n`)
        return
    }

    try {
        await Ace.bindAce(el, mode, theme)
    }
    catch (e) {
        insertText(el, `${e}\n`)
    }
}

const initGithub = async (el: HTMLElement) => {
    return ''
}

const initGist = async (el: HTMLElement) => {
    const gistId = el.dataset.gistid

    if (!gistId) {
        insertText(el, `'data-gistid' attribute not found.\n`)
        return
    }

    const fileName = el.dataset.filename

    if (!fileName) {
        insertText(el, `'data-filename' attribute not found.\n`)
        return
    }

    const timeoutStr = el.dataset.timeout
    const timeout    = timeoutStr ? parseInt(timeoutStr) : C.timeout

    if (Number.isNaN(timeout)) {
        insertText(el, 'Invalid timeout value.\n')
        return
    }

    try {
        return await Gist.fetchGistCode(gistId, fileName, timeout)
    }
    catch (e) {
        insertText(el, `${e}\n`)
        return ''
    }
}

const insertText = (el: HTMLElement, message: string) => {
    const editor = window.ace?.edit && window.ace.edit(el)

    if (editor) {
        editor.selectAll()
        editor.insert('')
        editor.navigateFileEnd()
        editor.insert(message)
    }
    else {
        console.log(message)
    }
}
