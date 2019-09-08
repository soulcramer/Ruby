import Global = NodeJS.Global;
import { Client, VoiceConnection } from "discord.js";
import { Jukebox } from "../classes/Jukebox/jukebox";

interface Config {
  Discord: {
    RubyToken: string;
  };
  API: {
    Google: {
      youtubeParser: string;
    };
  };
}
export interface GlobalExt extends Global {
  Config: Config;
  baseAppDir: string;
  Rin: Client;
  voiceConnection: VoiceConnection;
  jukebox: Jukebox;
}

declare let global: GlobalExt;