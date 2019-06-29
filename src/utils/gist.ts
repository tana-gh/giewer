import * as XHR from '@/utils/xhr'

export const fetchGistCode = async (gistId: string, fileName: string, timeout: number) => {
    const json = await XHR.get(`https://api.github.com/gists/${gistId}`, timeout)
    const body = JSON.parse(json)
    
    if (!('files' in body)) {
        throw new Error('syntax error')
    }

    const files = body.files

    if (!(fileName in files)) {
        throw new Error('file not found')
    }

    const file = files[fileName]

    if (!('truncated' in file && 'content' in file)) {
        throw new Error('syntax error')
    }

    if (file.truncated) {
        throw new Error('content truncated')
    }
    
    return file.content
}
