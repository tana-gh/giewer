
module.exports = {
    plugins: [
        require('autoprefixer')({
            'browsers': [
                '> 0.5%',
                'last 2 version',
                'not dead'
            ]
        })
    ]
}
