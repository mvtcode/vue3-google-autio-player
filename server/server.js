import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const port = 3000

// Enable CORS
app.use(cors())

// Route để proxy audio từ Google Drive
app.get('/audio/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params

    // Tạo URL trực tiếp từ Google Drive
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

    // Lấy response từ Google Drive
    const response = await axios({
      method: 'get',
      url: driveUrl,
      responseType: 'stream',
    })

    // Set headers
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Accept-Ranges', 'bytes')

    // Pipe stream từ Google Drive về client
    response.data.pipe(res)
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Không thể tải file audio' })
  }
})

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})
