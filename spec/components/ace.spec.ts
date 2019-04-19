import $ = require('jquery')
import { appendAce } from '../../src/components/ace'

describe('ace', () => {
    it('appendAce', () => {
        const editor = $('<div></div>')
        const body   = $('body').append(editor)

        expect(body.children('script[src*="/ace.js"]')).toHaveLength(0)
        appendAce(editor.get(0))
        
        expect(body.children('script[src*="/ace.js"]')).toHaveLength(1)
    })
})
