import fs from 'node:fs'
import path from 'node:path'
import { v4 as uuidV4 } from 'uuid'
import glob from 'glob'
import chalk from 'chalk'
import ProgressBar from 'progress'

export const moveOrCopyFiles = ({
  systemPath,
  systemPathToMove,
  extentions,
  isCopy
}) => {
  const existPath = fs.existsSync(systemPath)
  if (!existPath) {
    throw new Error(`${chalk.red('[ERROR]:')} The path does not exist`)
  }

  const existPathToMove = fs.existsSync(systemPathToMove)
  if (!existPathToMove) {
    throw new Error(`${chalk.red('[ERROR]:')} The path to move does not exist`)
  }

  const globPath = `**/*.*(${extentions.join('|')})`
  const files = glob.sync(globPath, {
    cwd: path.join(systemPath),
    absolute: true
  })

  const filesLength = files.length

  console.info(`${filesLength} media files will be ${isCopy ? 'copy' : 'move'} ... \n`)

  const bar = new ProgressBar(`🐢 moving :current of :total files ${chalk.green('[:bar]')} :percent ::etas`, {
    total: filesLength,
    width: 20
  })

  try {
    for (let i = 0; i < filesLength; i++) {
      bar.tick()

      if (bar.complete) {
        console.log(chalk.green('\n✅ files moved successfully'))
      }

      const multiPath = files[i]
      const multiPathExt = path.extname(multiPath)
      const baseName = path.basename(multiPath, multiPathExt)
      const fileName = `${baseName}_${uuidV4()}${multiPathExt}`

      const sourcePath = multiPath
      const destinationPath = path.join(systemPathToMove, fileName)

      fs.copyFileSync(sourcePath, destinationPath)

      if (!isCopy) {
        fs.unlinkSync(sourcePath)
      }
    }
  } catch (err) {
    throw new Error(`\n${chalk.red('[Error]: error trying to move files -> ')} ${err}`)
  }
}
