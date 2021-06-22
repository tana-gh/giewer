import * as Urls from '../utils/urls'
import * as C    from '../utils/constants'

declare global {
    interface Window {
        ace: any
    }
}

const loadedKeys = [] as string[]

export const bindAce = async (element: Element, urls: Urls.Urls, mode?: string, theme?: string): Promise<void> => {
    if (element.classList.contains(C.aceEditorClass)) {
        return
    }

    await loadAceScript(urls.ace, 'ace')
    if (mode ) await loadModesScript (urls.modes , mode)
    if (theme) await loadThemesScript(urls.themes, theme)

    if (window.ace === undefined) {
        return
    }

    const editor = window.ace.edit(element)
    if (mode ) editor.session.setMode(`ace/mode/${mode}`)
    if (theme) editor.setTheme(`ace/theme/${theme}`)
}

const loadAceScript = async (ace: string, key: string) => {
    await loadScript(key, ace)
}

const loadModesScript = async (modes: Record<string, string>, key: string) => {
    await loadScript(key, modes[key])
}

const loadThemesScript = async (themes: Record<string, string>, key: string) => {
    await loadScript(key, themes[key])
}

const loadScript = async (key: string, url: string) => {
    if (loadedKeys.find(k => k === key) !== undefined) {
        return
    }

    loadedKeys.push(key)

    return await new Promise<void>((res, rej) => {
        const script = document.createElement('script')
        script.src   = url
        script.addEventListener('load', () => res())
        document.body.appendChild(script)
    })
}
