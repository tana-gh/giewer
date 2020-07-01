import * as C from './constants'

export const error = (message: string) => {
    console.error(`[${C.giewerName}] ${message}`)
}
