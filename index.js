/**
 * run project instructions
 * node index.js
 * --username myusername
 * --room room01
 * --hostUri localhost
 */

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import TerminalController from "./src/terminalController.js";

const [ nodePath, filePath, ...commands ] = process.argv;
const parsedArgs = CliConfig.parseArgs(commands);
console.log('parsedArgs ', parsedArgs)

const componentEmitter = new Events();
const controller = new TerminalController();

await controller.initializeTable(componentEmitter);