/**
* @author uo1428
* @support .gg/uoaio
* @Donate patreon.com/uoaio
* @Note Dont take any type credit 
*/
import dotenv from 'dotenv';
dotenv.config();
import colors from 'colors'
import boxConsole from 'box-console';
import Client from './src/client.mjs';
import antiCrash from './src/utils/antiCrash.mjs';
import config from './Assets/Config/config.mjs';
import embed from './Assets/Config/embed.mjs';
import emotes from './Assets/Config/emotes.mjs';

let aio = `Welcome to ${'Console'.blue.bold} by ${'ALL IN ONE | Development'.red}`;
let aio_server = `Support:- ${`https://discord.gg/uoaio`.brightGreen}`
let Uo = `Coded By ${`@uoaio`.brightCyan.bold}`;
console.clear()
boxConsole([aio, aio_server, Uo]);


const client = new Client()

client.start(config, embed, emotes).then(async c => {

  client.loadEvents();
  client.loadCommands()

}).catch(e => console.log(e.message))

antiCrash()
