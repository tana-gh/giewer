import $ = require('jquery')
import { createComponent } from '../src/main'

describe('main.ts', () => {
    it('createComponent', () => {
        const main = $('<div id="main"/>')
        $('body').append(main)

        expect(main.children()).toHaveLength(0)
        createComponent()
        expect(main.children()).toHaveLength(1)
        
        const h1 = main.children('h1')
        expect(h1.text()).toBe('Hello, world!')
    })
})
