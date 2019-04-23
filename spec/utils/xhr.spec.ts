import MockXMLHttpRequest from 'mock-xmlhttprequest'
import { xhr } from '../../src/utils/xhr'

describe('xhr', () => {
    it('should get response', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://example.com/', {
                headers: { 'Content-Type': 'application/json' },
                body: '{ "test": "ok" }'
            }]
        }).install()

        const content = await xhr('https://example.com/', 0)
        expect(content).toBe('{ "test": "ok" }')

        server.remove()
    })

    it('should get 404', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://example.com/', {
                status: 404
            }]
        }).install()

        const promise = xhr('https://example.com/', 0)
        await expect(promise).rejects.toEqual(new Error('404 Not Found'))

        server.remove()
    })

    it('should occur network error', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://example.com/', xhr => {
                xhr.setNetworkError()
            }]
        }).install()

        const promise = xhr('https://example.com/', 0)
        await expect(promise).rejects.toEqual(new Error('xhr error'))

        server.remove()
    })

    it('should timeout', async () => {
        const server = MockXMLHttpRequest.newServer({
            get: ['https://example.com/', xhr => {
                xhr.setRequestTimeout()
            }]
        }).install()

        const promise = xhr('https://example.com/', 0)
        await expect(promise).rejects.toEqual(new Error('timeout'))

        server.remove()
    })
})
