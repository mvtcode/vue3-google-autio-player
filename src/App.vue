<script setup lang="ts">
import { ref } from 'vue'
import AudioPlayer from './components/AudioPlayer.vue'
import AudioPlayerBE from './components/AudioPlayerBE.vue'

const currentPlayer = ref<'nginx' | 'backend'>('nginx')
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Google Drive Audio Player</h1>
      <div class="player-switch">
        <el-radio-group v-model="currentPlayer" size="large">
          <el-radio-button label="nginx">
            <el-icon><Connection /></el-icon>
            Nginx Proxy (Port 8008)
          </el-radio-button>
          <el-radio-button label="backend">
            <el-icon><Monitor /></el-icon>
            Express Backend (Port 3000)
          </el-radio-button>
        </el-radio-group>
      </div>
    </header>
    <main>
      <Transition name="fade" mode="out-in">
        <AudioPlayer v-if="currentPlayer === 'nginx'" />
        <AudioPlayerBE v-else />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

header {
  text-align: center;
  padding: 2rem 0;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

h1 {
  margin: 0;
  color: #409eff;
  font-size: 2rem;
}

.player-switch {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

main {
  padding: 2rem;
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
