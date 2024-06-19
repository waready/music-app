<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px">
    <pre>{{ song }}</pre>
    <q-footer elevated class="bg-white text-dark">
      <q-toolbar>
        <q-toolbar-title>
          <q-card>
            <q-linear-progress :value="valor" max="1" color="pink" id="segundo" class="q-pb-sm" ref="segundo" />
            <q-card-section class="row items-center no-wrap">
              <div class="q-mr-md">
                <div class="text-weight-bold">{{ song.title }}</div>
                <div class="text-grey">{{ song.artist }}</div>
              </div>
              <audio id="audio-player" style="width: 100%;" controls controlsList="nodownload" ref="audio1"
                @timeupdate="updateProgress" @play="onPlay">
                <source :src="'http://localhost:3000/mp3/' + song.audioPath" type="audio/ogg">
                <source :src="'http://localhost:3000/mp3/' + song.audioPath" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
              <q-space />
              <q-btn flat round icon="replay_circle_filled" @click="replay" />
              <q-btn flat round icon="fast_rewind" @click="previous" />
              <q-btn flat round icon="pause" @click="togglePlayPause" />
              <q-btn flat round icon="fast_forward" @click="next" />
            </q-card-section>
          </q-card>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <q-btn @click="initializeAudio">Start Playing</q-btn>
    <q-form @submit="handleDownload">
      <q-input filled v-model="url" label="YouTube URL" />
      <q-btn type="submit" label="Download MP3" />
    </q-form>
    <div v-if="resultVisible">
      <h2>Now Playing</h2>
      <p><strong>Title:</strong> {{ song.title }}</p>
      <p><strong>Artist:</strong> {{ song.artist }}</p>
    </div>
    <q-list>
      <q-item-label>Playlist</q-item-label>
      <q-item v-for="(item, index) in playlist" :key="index">
        <q-item-section>{{ index + 1 }}. {{ item.title }} - {{ item.artist }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { io } from 'socket.io-client';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      valor: 0,
      song: {
        title: '',
        artist: '',
        audioPath: ''
      },
      url: '',
      resultVisible: false,
      playlist: [],
      socket: null,
      userInteracted: false,
    };
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.setupSocketListeners();
    this.fetchPlaylist();
  },
  methods: {
    setupSocketListeners() {
      this.socket.on('newSong', this.handleNewSong);
      this.socket.on('play', this.playAudio);
      this.socket.on('stop', this.pauseAudio);
      this.socket.on('seek', this.seekAudio);
      this.socket.on('updatePlaylist', this.fetchPlaylist);
      this.socket.on('syncTime', this.syncTime);
    },
    handleNewSong(song) {
      this.song = song;
      const audio = this.$refs.audio1;
      if (audio) {
        audio.src = 'http://localhost:3000/mp3/' + song.audioPath;
        audio.load();
        if (this.userInteracted) {
          audio.play().catch((error) => {
            console.error('Error trying to play the audio:', error);
          });
        }
        this.resultVisible = true;
        this.isSyncing = true;
        this.socket.emit('requestSync');
        this.fetchPlaylist(); // Actualizar la lista de reproducción cuando se agrega una nueva canción
      }
    },
    initializeAudio() {
      const audio = this.$refs.audio1;
      if (audio) {
        audio.play().catch((error) => {
          console.error('Error trying to play the audio:', error);
        });
      }
    },
    playAudio() {
      const audio = this.$refs.audio1;
      if (audio) {
        audio.play();
      }
    },
    pauseAudio() {
      const audio = this.$refs.audio1;
      if (audio) {
        audio.pause();
      }
    },
    seekAudio(time) {
      const audio = this.$refs.audio1;
      if (audio) {
        audio.currentTime = time;
      }
    },
    replay() {
      const audio = this.$refs.audio1;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    },
    togglePlayPause() {
      const audio = this.$refs.audio1;
      if (audio) {
        if (audio.paused) {
          audio.play();
          this.socket.emit('play');
        } else {
          audio.pause();
          this.socket.emit('stop');
        }
      }
    },
    previous() {
      this.socket.emit('previous');
    },
    next() {
      this.socket.emit('next');
    },
    updateProgress() {
      const audio = this.$refs.audio1;
      if (audio) {
        this.valor = audio.currentTime / audio.duration;
      }
    },
    fetchPlaylist() {
      fetch('http://localhost:3000/playlist')
        .then(response => response.json())
        .then(playlist => {
          this.playlist = playlist;
        })
        .catch(error => console.error('Error fetching playlist:', error));
    },
    handleDownload(e) {
      e.preventDefault();
      fetch(`http://localhost:3000/download?url=${encodeURIComponent(this.url)}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            // Emitir la nueva canción a todos los clientes
            this.socket.emit('playSong', {
              title: data.title,
              artist: data.artist,
              audioPath: data.audio_path
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to download audio');
        });
    },
    onPlay() {
      this.userInteracted = true; // Marca que el usuario ha interactuado
    },
    syncTime({ time, isPlaying }) {
      const audio = this.$refs.audio1;
      const currentTime = audio.currentTime;
      const offset = Math.abs(currentTime - time);
      if (offset > 1) {
        audio.currentTime = time;
      }
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
      this.isSyncing = false;
    }
  }
});
</script>

<style>
/* Agrega tus estilos aquí */
</style>
