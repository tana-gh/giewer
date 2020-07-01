import * as Urls from '../utils/urls'
import * as C    from '../utils/constants'

declare global {
    interface Window {
        ace: any
    }
}

const loadedKeys = <(Urls.AceKey | Urls.ModeKey | Urls.ThemeKey)[]>[]

export const bindAce = async (element: Element, mode?: Urls.ModeKey, theme?: Urls.ThemeKey) => {
    if (element.classList.contains(C.aceEditorClass)) {
        return
    }

    await loadAceScript('ace')
    if (mode ) await loadModesScript (mode)
    if (theme) await loadThemesScript(theme)

    if (window.ace === undefined) {
        return
    }

    const editor = window.ace.edit(element)
    if (mode ) editor.session.setMode(`ace/mode/${mode}`)
    if (theme) editor.setTheme(`ace/theme/${theme}`)
}

const loadAceScript = async (key: Urls.AceKey) => {
    await loadScript(key, Urls.ace[key])
}

const loadModesScript = async (key: Urls.ModeKey) => {
    await loadScript(key, Urls.modes[key])
}

const loadThemesScript = async (key: Urls.ThemeKey) => {
    await loadScript(key, Urls.themes[key])
}

const loadScript = async (key: Urls.AceKey | Urls.ModeKey | Urls.ThemeKey, url: string) => {
    if (loadedKeys.find(k => k === key) !== undefined) {
        return
    }

    loadedKeys.push(key)

    return await new Promise((res, rej) => {
        const script = document.createElement('script')
        script.src   = url
        script.addEventListener('load', () => res())
        document.body.appendChild(script)
    })
}
