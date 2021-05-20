import $        from 'jquery'
import * as Ace from '../../src/components/ace'

describe('appendAce', () => {
    it('should be appended correctly', async () => {
        const editor = $('<div></div>')
        const body   = $('body').append(editor)

        expect(editor.children()).toHaveLength(0)
        expect(body.children('script[src*="/ace.min.js"]')).toHaveLength(0)

        const appendAceSequence = async () => {
            const promise = Ace.bindAce(editor.get(0))
            const script  = body.children('script[src*="/ace.min.js"]').get(0)
            script.dispatchEvent(new Event('load'))
            await promise
        }

        await appendAceSequence()
        await appendAceSequence()
    })
})
