import * as Ace  from './ace'
import * as Gist from '../utils/gist'
import * as Log  from '../utils/log'
import * as Urls from '../utils/urls'
import * as C    from '../utils/constants'

export const initComponents = async (selector: string): Promise<void> => {
    const targets = document.querySelectorAll(selector)
    targets.forEach(async el => await initOneComponent(el as HTMLElement))
}

export const initOneComponent = async (el: HTMLElement): Promise<void> => {
    const timeoutStr = el.getAttribute('timeout')
    const timeout    = timeoutStr ? parseInt(timeoutStr) : C.timeout

    const urls = await Urls.loadUrls(timeout)

    await bindAceToElement(el, urls)
    
    if (!el.classList.contains(C.aceEditorClass)) {
        Log.error('Failed to bind ace editor.')
        return
    }

    const service = el.getAttribute('service') ?? undefined

    let content: string | undefined

    if (service === C.services.github) {
        content = await initGithub(el, timeout)
    }
    else if (service === C.services.gist) {
        content = await initGist(el, timeout)
    }
    else if (service === C.services.raw || !service) {
        content = undefined
    }
    else {
        insertError(el, new Error('Invalid service name.'))
        return
    }

    if (content !== undefined) insertText(el, content)
}

const bindAceToElement = async (el: HTMLElement, urls: Urls.Urls) => {
    let mode = el.getAttribute('mode') ?? undefined
    if (!mode) mode = 'text'

    if (!Urls.isModeKey(urls.modes, mode)) {
        insertError(el, new Error(`Invalid mode ${mode}.`))
        mode = 'text'
    }

    let theme = el.getAttribute('theme') ?? undefined
    if (!theme) theme = 'tomorrow_night'
    
    if (!Urls.isThemeKey(urls.themes, theme)) {
        insertError(el, new Error(`Invalid theme ${theme}.`))
        theme = 'tomorrow_night'
    }

    try {
        await Ace.bindAce(el, urls, mode, theme)
    }
    catch (e) {
        insertError(el, e)
    }
}

const initGithub = async (el: HTMLElement, timeout: number) => {
    return ''
}

const initGist = async (el: HTMLElement, timeout: number) => {
    const gistId = el.getAttribute('gistid') ?? undefined

    if (!gistId) {
        insertError(el, new Error(`'gistid' attribute not found.`))
        return
    }

    const fileName = el.getAttribute('filename')

    if (!fileName) {
        insertError(el, new Error(`'filename' attribute not found.`))
        return
    }

    if (Number.isNaN(timeout)) {
        insertError(el, new Error('Invalid timeout value.'))
        return
    }

    try {
        return await Gist.fetchGistCode(gistId, fileName, timeout)
    }
    catch (e) {
        insertError(el, e)
        return
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
        Log.error('Editor not found.')
    }
}

const insertError = (el: HTMLElement, error: Error) => {
    const editor = window.ace?.edit && window.ace.edit(el)

    if (editor) {
        editor.selectAll()
        editor.insert('')
        editor.navigateFileEnd()
        editor.insert(`${error}\n`)
    }
    else {
        Log.error(error.message)
    }
}
