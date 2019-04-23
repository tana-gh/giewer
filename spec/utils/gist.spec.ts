import MockXMLHttpRequest from 'mock-xmlhttprequest'
import { fetchGistCode }  from '../../src/utils/gist'

describe('fetchGistCode', () => {
    it('should fetch content correctly', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://api.github.com/gists/test-id', {
                headers: { 'Content-Type': 'application/json' },
                body: `{
                    "files": {
                        "test-filename": {
                            "truncated": false,
                            "content"  : "test code"
                        }
                    }
                }`
            }]
        }).install()

        const content = await fetchGistCode('test-id', 'test-filename', 0)
        expect(content).toBe('test code')

        server.remove()
    })

    it('throw due to files not exists', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://api.github.com/gists/test-id', {
                headers: { 'Content-Type': 'application/json' },
                body: `{}`
            }]
        }).install()

        const promise = fetchGistCode('test-id', 'test-filename', 0)
        await expect(promise).rejects.toEqual(new Error('syntax error'))

        server.remove()
    })

    it('throw due to file not found', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://api.github.com/gists/test-id', {
                headers: { 'Content-Type': 'application/json' },
                body: `{
                    "files": {
                        "other-filename": {
                            "truncated": false,
                            "content"  : "test code"
                        }
                    }
                }`
            }]
        }).install()

        const promise = fetchGistCode('test-id', 'test-filename', 0)
        await expect(promise).rejects.toEqual(new Error('file not found'))

        server.remove()
    })

    it('throw due to truncated not exists', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://api.github.com/gists/test-id', {
                headers: { 'Content-Type': 'application/json' },
                body: `{
                    "files": {
                        "test-filename": {
                            "content"  : "test code"
                        }
                    }
                }`
            }]
        }).install()

        const promise = fetchGistCode('test-id', 'test-filename', 0)
        await expect(promise).rejects.toEqual(new Error('syntax error'))

        server.remove()
    })

    it('throw due to content not exists', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://api.github.com/gists/test-id', {
                headers: { 'Content-Type': 'application/json' },
                body: `{
                    "files": {
                        "test-filename": {
                            "truncated": false
                        }
                    }
                }`
            }]
        }).install()

        const promise = fetchGistCode('test-id', 'test-filename', 0)
        await expect(promise).rejects.toEqual(new Error('syntax error'))

        server.remove()
    })

    it('throw due to content truncated', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://api.github.com/gists/test-id', {
                headers: { 'Content-Type': 'application/json' },
                body: `{
                    "files": {
                        "test-filename": {
                            "truncated": true,
                            "content"  : "test code"
                        }
                    }
                }`
            }]
        }).install()

        const promise = fetchGistCode('test-id', 'test-filename', 0)
        await expect(promise).rejects.toEqual(new Error('content truncated'))

        server.remove()
    })
})
