import { JUKEBOX_STATE } from "../components/jukebox";
import { VoiceChannel } from "discord.js";
import { JukeboxItemAPI, JukeboxItemDetails } from "./jukebox-item-API";

export interface JukeboxAPI {
  state: JUKEBOX_STATE;
  queue: JukeboxItemAPI[];
  currentSong: JukeboxItemAPI;
  connect(vc: VoiceChannel): Promise<void>;
  addSong(query: string): Promise<void>;
  getCurrentSongDetails(): Promise<JukeboxItemDetails>;
  play(): Promise<void>;
  skip(): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): Promise<void>;
  loop(isLooping: boolean): void;
  remove(index: number): void;
  /** Subscribe a function to a song transition event **/
  onNewSong(f: (...args: any[]) => void): void;
  onQueueEmpty(f: (...args: any[]) => void): void;
  onSongStart(f: (...args: any[]) => void): void
}
