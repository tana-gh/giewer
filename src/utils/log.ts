import * as C from './constants'

export const error = (message: string): void => {
    console.error(`[${C.giewerName}] ${message}`)
}
