var ejs = require('ejs')
var fs = require('fs')
var hasha = require('hasha')

console.log('index.html start')

const mainjs = hasha.fromFile('www/build/main.js', { algorithm: 'md5' })
const maincss = hasha.fromFile('www/build/main.css', { algorithm: 'md5' })

Promise.all([mainjs, maincss]).then(([mainjs, maincss]) => {
    fs.readFile('src/index.html', { encoding: 'utf-8' }, (err, data) => {

        if (err) return

        const result = ejs.render(data, {
            'mainjs': mainjs,
            'maincss': maincss,
        })

        fs.writeFile('www/index.html', result)

        console.log('index.html end')
    })
})