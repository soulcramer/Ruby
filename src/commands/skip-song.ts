import { Message } from "discord.js";
import { JukeboxCommand } from "../components/jukebox-command";
import { voiceChannelOnly } from "../decorators/voice-channel-only";
import { JUKEBOX_STATE } from "../components/jukebox";

export default class SkipSong extends JukeboxCommand {
  constructor(client) {
    super(client, {
      name: "skip",
      memberName: "skip",
      group: "music",
      description: "Skip currently playing song",
      examples: ["?skip"]
    });
  }

  @voiceChannelOnly()
  async run(message, args: never): Promise<Message> {
    await super.run(message, undefined);
    const jukebox = await this.getJukebox(
      await this.getTargetVoiceChannel(message)
    );
    if (jukebox.state === JUKEBOX_STATE.PLAYING) {
      await jukebox.skip();
    }
    if (jukebox.queue) await message.say(await this.formatQueue());
    return message;
  }
}
