module.exports = {
    extends: '@trendmicro/babel-config',
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: 3,
                targets: {
                    ie: 11,
                },
                useBuiltIns: 'usage',
            }
        ],
        '@babel/preset-react'
    ]
};
