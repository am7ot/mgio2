const Discord = require('discord.js');
const client = new Discord.Client();
const { token, prefix } = require('./config.json');
const ytdl = require('ytdl-core');

const queue = new Map();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.author.bot) return; // Ignore messages from other bots
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send('You need to be in a voice channel to play music.');
    }

    const serverQueue = queue.get(message.guild.id);
    const songURL = args[0];

    if (!songURL) {
      return message.channel.send('You need to provide a YouTube URL for the song you want to play.');
    }

    const songInfo = await ytdl.getInfo(songURL);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel,
        connection: null,
        songs: [],
        volume: 5, // You can adjust the volume
        playing: true,
      };

      queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(error);
        queue.delete(message.guild.id);
        return message.channel.send(`I couldn't join the voice channel: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  } else if (command === 'stop') {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      serverQueue.playing = false;
    }
  }
});

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection.play(ytdl(song.url, { filter: 'audioonly' }))
    .on('finish', () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', (error) => {
      console.error(error);
    });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now playing: ${song.title}`);
}

client.login(token);
