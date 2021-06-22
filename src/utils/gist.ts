import * as XHR from './xhr'

export const fetchGistCode = async (gistId: string, fileName: string, timeout: number): Promise<string | never> => {
    const json = await XHR.get(`https://api.github.com/gists/${gistId}`, timeout)
    const body = JSON.parse(json)

    if (!('files' in body)) {
        throw new Error('JSON syntax error.')
    }

    const files = body.files

    if (!(fileName in files)) {
        throw new Error('File not found.')
    }

    const file = files[fileName]

    if (!('truncated' in file && 'content' in file)) {
        throw new Error('JSON syntax error.')
    }

    if (file.truncated) {
        throw new Error('Content truncated.')
    }

    return file.content
}
