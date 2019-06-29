import $ = require('jquery')
import * as Ace from '../../src/components/ace'
import * as C   from '../../src/utils/constants'

describe('appendAce', () => {
    it('should be appended correctly', async () => {
        const editor = $('<div></div>')
        const body   = $('body').append(editor)

        expect(editor.children()).toHaveLength(0)
        expect(body.children('script[src*="/ace.js"]')).toHaveLength(0)

        const appendAceSequence = async () => {
            const promise = Ace.bindAce(editor.get(0))
            const script  = body.children('script[src*="/ace.js"]').get(0)
            script.dispatchEvent(new Event('load'))
            await promise
        }

        await appendAceSequence()
        await appendAceSequence()
    })
})
