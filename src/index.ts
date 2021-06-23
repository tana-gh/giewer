import '../assets/scss/style.scss'
import * as Giewer from './components/giewer'

window.addEventListener('DOMContentLoaded', async () => {
    await Giewer.initComponents('.giewer')
})
