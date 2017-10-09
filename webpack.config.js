const path = require('path')

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.resolve('node_modules')],
        alias: {
            APP_CONFIG: path.resolve(__dirname, 'app.config.json'),
            services: path.resolve(__dirname, 'src/services'),
        }
    },
};