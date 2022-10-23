#!/usr/bin/env node

import inquirer from 'inquirer'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { listExtFromFolder } from './listExtFromFolder.js'
import { moveOrCopyFiles } from './moveOrCopyFiles.js'

const argv = yargs(hideBin(process.argv))
  .scriptName('move-media')
  .usage('$0 <command> [args]')
  .command('list-ext', 'list all extensions from the source folder', {
    path: {
      alias: 'p',
      demandOption: true,
      describe: 'Root folder path where the files are',
      type: 'string'
    }
  })
  .command('move', 'move the files', {
    path: {
      alias: 'p',
      demandOption: true,
      describe: 'Root folder path where the files are',
      type: 'string'
    },
    'destination-path': {
      alias: 'd',
      demandOption: true,
      describe: 'Path of the folder where the files will be moved',
      type: 'string'
    },
    ext: {
      alias: 'e',
      array: true,
      default: ['png', 'jpg', 'jpeg'],
      describe: 'Extensions to look for in the path',
      type: 'array',
      defaultDescription: 'png jpg jpeg'
    }
  })
  .command('copy', 'copy the files from source path to target path', {
    path: {
      alias: 'p',
      demandOption: true,
      describe: 'Root folder path where the files are',
      type: 'string'
    },
    'destination-path': {
      alias: 'd',
      demandOption: true,
      describe: 'Path of the folder where the files will be moved',
      type: 'string'
    },
    ext: {
      alias: 'e',
      array: true,
      default: ['png', 'jpg', 'jpeg'],
      describe: 'Extensions to look for in the path',
      type: 'array',
      defaultDescription: 'png jpg jpeg'
    }
  })
  .help()
  .version('1.0.15')
  .argv

const systemPath = argv.path
const systemPathToMove = argv.destinationPath
const extentions = argv.ext

const command = argv._[0]
switch (command) {
  case 'list-ext': {
    listExtFromFolder(systemPath)
    break
  }
  case 'move': {
    inquirer.prompt({
      type: 'confirm',
      name: 'wantToMove',
      message: 'Are you sure you want to move the files? this will remove the files from the root folder'
    }).then((answers) => {
      if (answers.wantToMove) {
        moveOrCopyFiles({
          systemPath,
          systemPathToMove,
          extentions,
          isCopy: false
        })
      } else {
        console.log('ufff thank god we realized before moving and deleting')
      }
    })
    break
  }
  case 'copy': {
    moveOrCopyFiles({
      systemPath,
      systemPathToMove,
      extentions,
      isCopy: true
    })
    break
  }
}
