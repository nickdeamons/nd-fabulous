var path = require('path');

module.exports = {
    entry: {
        main:'./src/scripts/main.js', 'fabricator/f': './src/scripts/fabricator/fabricator.js'
    },
    output: {
        path: path.resolve(__dirname, "dist/assets/scripts"), // string
        publicPath:"",
        filename: '[name].js'
    },
    mode: 'development',
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            use: 'babel-loader'
        }, {
            test: /\.vue?$/,
            exclude: /(node_modules|bower_components)/,
            use: 'vue-loader'
        }]
    }
}