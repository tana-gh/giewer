import * as XHR from './utils/xhr.mjs'

const main = async () => {
    const origin  = 'https://api.cdnjs.com'
    const timeout = 30000

    const versions =
        JSON.parse(await XHR.get(`${origin}/libraries/ace?fields=versions`, timeout))
    const latest =
        versions.versions
            .map(v => v.split('.'))
            .filter(vs => vs.length === 3)
            .map(vs => vs.map(v => Number.parseInt(v)))
            .filter(vs => vs.filter(v => isNaN(v)).length === 0)
            .reduce((vs0, vs1) =>
                vs0[0] > vs1[0] ? vs0 :
                vs0[0] < vs1[0] ? vs1 :
                vs0[1] > vs1[1] ? vs0 :
                vs0[1] < vs1[1] ? vs1 :
                vs0[2] > vs1[2] ? vs0 : vs1)
            .join('.')
    
    const files =
        JSON.parse(await XHR.get(`${origin}/libraries/ace/${latest}?fields=files`, timeout))
    const minjs = files.files.filter(name => name.endsWith('.min.js'))
    const modes  = minjs.filter(name => name.startsWith('mode-'))
    const themes = minjs.filter(name => name.startsWith('theme-'))

    const modeNames  = modes .map(name => name.replace(/^mode-/ , '').replace(/.min.js$/, ''))
    const themeNames = themes.map(name => name.replace(/^theme-/, '').replace(/.min.js$/, ''))

    const url = 'https://cdnjs.cloudflare.com/ajax/libs/ace'
    const modeUrls  = modes .map(name => `${url}/${latest}/${name}`)
    const themeUrls = themes.map(name => `${url}/${latest}/${name}`)

    const modeLines  = modeNames .map((name, i) => `    "${name}": "${modeUrls [i]}"`)
    const themeLines = themeNames.map((name, i) => `    "${name}": "${themeUrls[i]}"`)

    const json = [
        `{`,
        `  "ace": "${url}/${latest}/ace.min.js",`,
        `  "modes": {`,
        modeLines.join(',\n'),
        `  }`,
        `  "themes": {`,
        themeLines.join(',\n'),
        `  }`,
        `}`,
        ``
    ].join('\n')

    console.log(json)
}

await main()
