import urls from '@/utils/urls'

declare const ace

const loadedUrls = {
    ace   : {},
    modes : {},
    themes: {}
}

export const appendAce = async (element: Element, mode?: string, theme?: string) => {
    await loadScript('ace'  , 'ace')
    await loadScript('mode' , mode )
    await loadScript('theme', theme)

    const editor = ace.edit(element)
    if (mode ) editor.session.setMode(`ace/mode/${mode}`)
    if (theme) editor.setTheme(`ace/theme/${theme}`)
}

const loadScript = async (kind: 'ace' | 'mode' | 'theme', key: string | undefined) => {
    if (!key) {
        return Promise.resolve('no script loaded')
    }

    if (!(key in urls[kind]) || key in loadedUrls[kind]) {
        return Promise.resolve('already loaded')
    }

    loadedUrls[kind][key] = urls[kind][key]

    return await new Promise((res, rej) => {
        const script  = document.createElement('script')
        script.src    = urls[kind][key]
        script.onload = () => res('ok')
        document.body.appendChild(script)
    })
}
