# Vue 3 Google Audio Player

Ứng dụng này cho phép phát và tải xuống các file audio từ Google Drive thông qua hai phương pháp:

1. **Express Backend** - Phương pháp ổn định và đáng tin cậy nhất
2. **Nginx Proxy** - Phương pháp thử nghiệm (có thể không hoạt động với tất cả các file)

## Cách chạy ứng dụng

### Sử dụng Docker (Khuyến nghị)

Cách này sẽ chạy cả Express backend và Nginx trong cùng một container:

```bash
# Build image
docker build -t vue-audio-player .

# Chạy container
docker run -p 8008:80 vue-audio-player
```

Sau đó truy cập ứng dụng tại `http://localhost:8008`

### Chạy riêng từng phần

1. **Frontend:**

```bash
npm install
npm run dev
```

2. **Express Backend:**

```bash
cd server
npm install
npm start
```

## Các tính năng

- Phát audio trực tiếp từ Google Drive
- Tải xuống file audio
- Hỗ trợ điều khiển phát/tạm dừng và tua
- Hiển thị thời gian phát
- Hỗ trợ cả nhập URL Google Drive và file ID

## Yêu cầu

- File audio phải được chia sẻ công khai trên Google Drive
- URL phải là đường dẫn chia sẻ Google Drive hợp lệ

## Khắc phục sự cố

Nếu bạn gặp vấn đề khi sử dụng Nginx proxy (lỗi 403, 502), hãy chuyển sang sử dụng Express backend bằng cách chọn "Express Backend" trong ứng dụng. Google Drive có nhiều hạn chế khi truy cập trực tiếp qua proxy, vì vậy Express backend là phương pháp đáng tin cậy hơn.

## Cấu trúc dự án

```
├── Dockerfile             # Cấu hình Docker cho cả frontend và backend
├── docker-entrypoint.sh   # Script khởi động cho Docker
├── nginx-express.conf     # Cấu hình Nginx kết hợp Express
├── nginx.conf             # Cấu hình Nginx (chỉ proxy)
├── server/                # Express backend
│   ├── server.js          # Mã nguồn Express server
│   └── package.json       # Dependencies cho Express
└── src/                   # Frontend Vue 3
    ├── App.vue            # Component chính
    ├── components/        # Các component
    │   ├── AudioPlayer.vue     # Audio player dùng Nginx
    │   └── AudioPlayerBE.vue   # Audio player dùng Express
    └── ...
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
