import * as Ace from '../../src/components/ace'

describe('appendAce', () => {
    it('should be appended correctly', async () => {
        const editor = document.createElement('div')
        const body   = document.body

        expect(editor.children).toHaveLength(0)
        expect(body.querySelectorAll('script[src*="/ace.min.js"]')).toHaveLength(0)

        const appendAceSequence = async () => {
            const promise = Ace.bindAce(editor)
            const script  = body.querySelector('script[src*="/ace.min.js"]')
            script?.dispatchEvent(new Event('load'))
            await promise
        }

        await appendAceSequence()
        await appendAceSequence()
    })
})
