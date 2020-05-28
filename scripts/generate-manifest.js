const fs = require('fs')
const chalk = require('chalk')

const pkg = require('../package.json')

function findFiles (path, ext, url) {
  return fs.readdirSync('./dist' + path)
    .filter((file) => {
      const parts = file.split('.')
      const fileExt = parts[parts.length - 1]

      return fileExt === ext
    })
    .map((file) => {
      return `{ src: '${url + path + '/' + file}', type: '${ext}' }`
    })
}

try {
  console.log('Generating app manifest...\n')

  const appUrl = pkg.constants.appUrl

  const files = [
    ...findFiles('/css', 'css', appUrl),
    ...findFiles('/js', 'js', appUrl)
  ].join(',\n    ')

  const manifest = `(function () {
  const files = [
    ${files}
  ]

  files.forEach((file) => {
    if (file.type === 'css') {
      const src = file.src
      const tag = document.createElement('link')

      tag.rel = 'stylesheet'
      tag.type = 'text/css'
      tag.href = src

      document.head.appendChild(tag)
    } else {
      const src = file.src
      const tag = document.createElement('script')

      tag.src = src

      document.body.appendChild(tag)
    }
  })
})()
`

  fs.writeFileSync('./dist/index.js', manifest, 'utf8')
  console.log(chalk.bgGreen.black(' DONE ') + ' Manifest successfully generated.\n')

  process.exit(0)
} catch (err) {
  process.exit(1)
}
