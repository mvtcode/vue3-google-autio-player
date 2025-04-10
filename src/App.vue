<script setup lang="ts">
import AudioPlayer from './components/AudioPlayer.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Google Drive Audio Player</h1>
    </header>
    <main>
      <AudioPlayer />
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
}

h1 {
  margin: 0;
  color: #409eff;
  font-size: 2rem;
}

main {
  padding: 2rem;
}
</style>
