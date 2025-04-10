import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Route để phục vụ các tệp audio từ Google Drive
app.get('/audio/:fileId', async (req, res) => {
  const fileId = req.params.fileId

  if (!fileId) {
    return res.status(400).send('Missing file ID')
  }

  try {
    // Tạo URL trực tiếp để tải xuống từ Google Drive
    const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`

    // Thực hiện yêu cầu tới Google Drive với các header giả lập trình duyệt
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Referer: 'https://drive.google.com/',
      },
      maxRedirects: 5, // Cho phép chuyển hướng nhiều lần nếu cần
      timeout: 30000, // 30 giây timeout
    })

    // Thiết lập header phản hồi để phù hợp với loại nội dung từ Google Drive
    res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg')
    res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'inline')

    // Thiết lập CORS header
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')

    // Truyền stream dữ liệu tới client
    response.data.pipe(res)
  } catch (error) {
    console.error('Error proxying Google Drive file:', error.message)

    // Xử lý lỗi và trả về thông tin chi tiết hơn
    if (error.response) {
      return res
        .status(error.response.status)
        .send(`Google Drive Error: ${error.response.statusText}`)
    } else if (error.request) {
      return res.status(500).send('No response from Google Drive server')
    } else {
      return res.status(500).send(`Error: ${error.message}`)
    }
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'OK', message: 'Express server is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})
