// globals.js
import { join } from "path";

globalThis.API = 'https://www.samirxpikachu.run.place';
import gradient from 'gradient-string';

function createGradientLogger() {
    const colors = ['blue', 'cyan'];
    return (message) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color1 = colors[colorIndex];
        const color2 = colors[(colorIndex + 1) % colors.length];
        const gradientMessage = gradient(color1, color2)(message);
        console.log(gradientMessage);
    };
}


let logger = createGradientLogger();


global.logger = logger;

export { logger };


const dirConfig = join(import.meta.dir, "..", "config.json");
const dirCmds = join(import.meta.dir, "..", "scripts", "cmds");
const dirEvent = join(import.meta.dir, "..", "scripts", "events");

global.db = {
    allThreadData: [],
    allUserData: [],
    allGlobalData: [],
    threadModel: null,
    userModel: null,
    threadsData: null,
    usersData: null,
};

global.client = {
    dirConfig,
    dirCmds,
    dirEvent,
    countDown: {},
    cache: {},
    database: {
        creatingThreadData: [],
        creatingUserData: [],
    },
};

global.XarV = {
    startTime: Date.now() - process.uptime() * 1000,
    commands: new Map(),
    eventCommands: new Map(),
    commandFilesPath: [],
    eventCommandsFilesPath: [],
    aliases: new Map(),
};

global.bot = {
  text: [],
  message: new Map(),
  reply: new Map(),
  inline_query: new Map(),
  chosen_inline_result: new Map(),
  callback_query: new Map(),
  shipping_query: new Map(),
  edited_message: new Map(),
  channel_post: [],
  edited_channel_post: [],
  pre_checkout_query: new Map(),
  poll: new Map(),
  poll_answer: new Map(),
  chat_member: new Map(),
  my_chat_member: new Map(),
  chat_join_request: new Map(),
  audio: new Map(),
  document: new Map(),
  photo: new Map(),
  sticker: new Map(),
  video: new Map(),
  video_note: new Map(),
  voice: new Map(),
  contact: new Map(),
  location: new Map(),
  venue: new Map(),
  new_chat_members: new Map(),
  left_chat_member: new Map(),
  new_chat_title: new Map(),
  new_chat_photo: new Map(),
  delete_chat_photo: new Map(),
  group_chat_created: new Map(),
  supergroup_chat_created: new Map(),
  channel_chat_created: new Map(),
  migrate_to_chat_id: new Map(),
  migrate_from_chat_id: new Map(),
  pinned_message: new Map()
};


export const XarV = global.XarV;
