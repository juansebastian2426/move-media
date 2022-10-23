import fs from 'node:fs'
import glob from 'glob'
import chalk from 'chalk'
import path from 'node:path'
import clipboard from 'clipboardy'

const validExtList = [
  'png', 'PNG',
  'jpg', 'JPG',
  'jpeg', 'JPEG',
  'mp4', 'MP4',
  'gif', 'GIF',
  'mov', 'MOV',
  'heic', 'HEIC'
]

export const listExtFromFolder = (sourcePath) => {
  try {
    const existPath = fs.existsSync(sourcePath)
    if (!existPath) {
      throw new Error(`${chalk.red('[ERROR]:')} The path does not exist`)
    }

    const globPath = '**/*.*'
    const files = glob.sync(globPath, {
      cwd: sourcePath
    })
    console.log(`${files.length} files found`)

    const extFound = []
    for (let i = 0; i < files.length; i++) {
      const multiPath = files[i]
      const multiPathExt = path.extname(multiPath).replace('.', '')

      if (!extFound.includes(multiPathExt)) {
        extFound.push(multiPathExt)
      }
    }

    const extToCopy = extFound.filter(ext => validExtList.includes(ext))
    const extToCopyString = extToCopy.join(' ')

    console.log(`Found (${extFound.length}) extensions: (${extFound})\n`)

    if (extToCopy.length === 0) {
      console.log('There are no valid extensions in the folder to move or copy ☹️')
      return
    }
    console.log(`The (${extToCopy}) are valid to move or copy and are copied in the clipboard`)

    clipboard.writeSync(extToCopyString)
  } catch (err) {
    throw new Error(`${chalk.red('[Error]: error trying to list extensions -> ')} ${err}`)
  }
}
