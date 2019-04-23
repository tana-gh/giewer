import urls   from '@/utils/urls'
import * as C from '@/utils/constants'

declare var ace

const loadedUrls = {
    ace   : {},
    modes : {},
    themes: {}
}

export const appendAce = async (element: Element, mode?: string, theme?: string) => {
    if (element.classList.contains(C.aceEditorClass)) {
        return
    }
    
    await loadScript('ace'  , 'ace')
    await loadScript('mode' , mode )
    await loadScript('theme', theme)

    if (typeof ace === 'undefined') {
        return
    }

    const editor = ace.edit(element)
    if (mode ) editor.session.setMode(`ace/mode/${mode}`)
    if (theme) editor.setTheme(`ace/theme/${theme}`)
}

const loadScript = async (kind: 'ace' | 'mode' | 'theme', key: string | undefined) => {
    if (!key) {
        return
    }

    if (!(key in urls[kind]) || key in loadedUrls[kind]) {
        return
    }

    loadedUrls[kind][key] = urls[kind][key]

    return await new Promise((res, rej) => {
        const script  = document.createElement('script')
        script.src    = urls[kind][key]
        script.onload = () => res()
        document.body.appendChild(script)
    })
}
