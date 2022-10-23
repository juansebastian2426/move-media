#!/usr/bin/env node

import chalk from 'chalk'
import inquirer from 'inquirer'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { moveOrCopyFiles } from './moveOrCopyFiles.js'

const argv = yargs(hideBin(process.argv))
  .scriptName('mv-media')
  .usage('$0 [args]')
  .option('ext', {
    alias: 'e',
    array: true,
    default: ['png', 'jpg', 'jpeg'],
    describe: 'Extensions to look for in the path',
    type: 'array',
    defaultDescription: 'png jpg jpeg'
  })
  .option('path', {
    alias: 'p',
    demandOption: true,
    describe: 'Root folder path where the files are',
    type: 'string'
  })
  .option('pathToMove', {
    alias: 'm',
    demandOption: true,
    describe: 'Path of the folder where the files will be moved',
    type: 'string'
  })
  .option('cp', {
    alias: 'c',
    default: true,
    describe: `Do you want to copy or move the files?. ${chalk.green('true')} if you want to copy ${chalk.red('false')} if you want to move them`,
    type: 'boolean'
  })
  .argv

const systemPath = argv.path
const systemPathToMove = argv.pathToMove
const extentions = argv.ext
const isCopy = argv.cp

inquirer.prompt({
  when: !isCopy,
  type: 'confirm',
  name: 'wantToMove',
  message: 'Are you sure you want to move the files? this will remove the files from the root folder'
}).then(() => {
  moveOrCopyFiles({
    systemPath,
    systemPathToMove,
    extentions,
    isCopy
  })
})
