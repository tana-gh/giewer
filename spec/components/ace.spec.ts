import * as Ace  from '../../src/components/ace'
import * as Urls from '../../src/utils/urls'

describe('appendAce', () => {
    it('should be appended correctly', async () => {
        const editor = document.createElement('div')
        const body   = document.body

        expect(editor.children).toHaveLength(0)
        expect(body.querySelectorAll('script[src*="/ace.min.js"]')).toHaveLength(0)

        const urls = await Urls.loadUrls()

        const appendAceSequence = async () => {
            const promise = Ace.bindAce(editor, urls)
            const script  = body.querySelector('script[src*="/ace.min.js"]')
            script?.dispatchEvent(new Event('load'))
            await promise
        }

        await appendAceSequence()
        await appendAceSequence()
    })
})
