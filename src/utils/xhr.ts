
export const get = async (url: string, timeout: number): Promise<string> => {
    return await new Promise((res, rej) => {
        const req = new XMLHttpRequest()
        req.open('GET', url)
        req.timeout = timeout
        req.onload = () => {
            if (req.status === 200) {
                res(req.responseText)
            }
            else {
                rej(new Error(`${req.status} ${req.statusText}.`))
            }
        }
        req.onerror = () => {
            rej(new Error('XHR error.'))
        }
        req.ontimeout = () => {
            rej(new Error('Timeout.'))
        }
        req.send(null)
    })
}
