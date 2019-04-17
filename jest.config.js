
module.exports = {
    'moduleFileExtensions': [ 'js', 'ts' ],
    'moduleDirectories': [ 'node_modules' ],
    'moduleNameMapper': {
        '\\.(css|styl(us)?)$': 'identity-obj-proxy',
        '\\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$': '<rootDir>/mocks/fileMock.js',
        '^@/(.+)': '<rootDir>/src/$1'
    },
    'transform': {
        '\\.(js)$': 'babel-jest',
        '\\.(ts)$': 'ts-jest'
    },
    'testMatch': [
        '**/__tests__/**/*.([jt]s)',
        '**/*.(spec|test).([jt]s)'
    ],
    'collectCoverage': true,
    'collectCoverageFrom': [
        'src/**/*.([jt]s)',
        '!**/node_modules/**'
    ]
}
