<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const audioUrl = ref('http://localhost:8008/audio/1Giwm6I5XsW_ZOhoT9zrJgx68Yzro8yAD')
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const handleUrlChange = async () => {
  if (!audioUrl.value) return

  try {
    if (audioPlayer.value) {
      // Nếu URL đã là proxy URL, sử dụng trực tiếp
      if (audioUrl.value.includes('/audio/')) {
        audioPlayer.value.src = audioUrl.value
      } else {
        // Nếu là URL Google Drive, chuyển đổi thành proxy URL
        const fileId = audioUrl.value.match(/[-\w]{25,}/)
        if (!fileId) {
          ElMessage.error('URL Google Drive không hợp lệ')
          return
        }
        const proxyUrl = `/audio/${fileId[0]}`
        audioPlayer.value.src = proxyUrl
      }

      await audioPlayer.value.load()
      ElMessage.success('File audio đã được tải thành công')
    }
  } catch (error) {
    console.error('Error loading audio:', error)
    ElMessage.error('Không thể tải file audio. Vui lòng kiểm tra lại URL hoặc quyền truy cập file.')
  }
}

const togglePlay = async () => {
  if (!audioPlayer.value) return

  try {
    if (isPlaying.value) {
      audioPlayer.value.pause()
    } else {
      await audioPlayer.value.play()
    }
    isPlaying.value = !isPlaying.value
  } catch (error) {
    console.error('Error playing audio:', error)
    ElMessage.error(
      'Không thể phát file audio. Vui lòng kiểm tra lại URL hoặc quyền truy cập file.',
    )
  }
}

const updateTime = () => {
  if (!audioPlayer.value) return
  currentTime.value = audioPlayer.value.currentTime
  duration.value = audioPlayer.value.duration
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const handleSeek = (value: number) => {
  if (!audioPlayer.value) return
  audioPlayer.value.currentTime = value
}

const downloadAudio = () => {
  if (!audioUrl.value) return

  // Nếu URL đã là proxy URL, sử dụng trực tiếp
  if (audioUrl.value.includes('/audio/')) {
    window.open(audioUrl.value, '_blank')
    return
  }

  // Nếu là URL Google Drive, chuyển đổi thành proxy URL
  const fileId = audioUrl.value.match(/[-\w]{25,}/)
  if (!fileId) return

  window.open(`/audio/${fileId[0]}`, '_blank')
}

onMounted(() => {
  audioPlayer.value = document.querySelector('audio')
  if (audioPlayer.value) {
    audioPlayer.value.addEventListener('timeupdate', updateTime)
    audioPlayer.value.addEventListener('loadedmetadata', updateTime)
    audioPlayer.value.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      ElMessage.error('Có lỗi khi tải file audio. Vui lòng kiểm tra server đã chạy chưa.')
    })
    // Tự động load URL mặc định khi component được mount
    handleUrlChange()
  }
})
</script>

<template>
  <div class="player-container">
    <el-card class="player-card">
      <template #header>
        <div class="card-header">
          <h3>Google Drive Audio Player</h3>
          <small class="note"
            >*Lưu ý: File audio phải được chia sẻ công khai trên Google Drive và server phải đang
            chạy</small
          >
        </div>
      </template>

      <div class="input-container">
        <el-input
          v-model="audioUrl"
          placeholder="Nhập URL Google Drive MP3"
          @change="handleUrlChange"
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="player-controls">
        <div class="button-group">
          <el-button
            :type="isPlaying ? 'danger' : 'primary'"
            @click="togglePlay"
            :icon="isPlaying ? 'Pause' : 'VideoPlay'"
          >
            {{ isPlaying ? 'Tạm dừng' : 'Phát' }}
          </el-button>

          <el-button type="success" @click="downloadAudio" icon="Download"> Tải về </el-button>
        </div>

        <div class="progress-container">
          <el-slider
            v-model="currentTime"
            :max="duration"
            @change="handleSeek"
            :format-tooltip="formatTime"
          />
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
      </div>

      <!-- Audio element -->
      <audio ref="audioPlayer" controls style="width: 100%; margin-top: 20px"></audio>
    </el-card>
  </div>
</template>

<style scoped>
.player-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.player-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.note {
  color: #909399;
  font-size: 12px;
}

.input-container {
  margin-bottom: 20px;
}

.player-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.progress-container {
  width: 100%;
}

.time-display {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  color: #666;
  font-size: 14px;
}
</style>
