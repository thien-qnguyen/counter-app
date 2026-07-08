# Bộ Đếm (Counter App)

Ứng dụng đếm số (counter) xây dựng bằng React + TypeScript + Vite, đóng gói bằng [Capacitor](https://capacitorjs.com) thành app Android native.

## Tech stack

- React 19 + TypeScript
- Vite 8 (build tool)
- Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`) — wrap web app thành Android app

## Phát triển

```bash
npm install
npm run dev       # dev server có HMR, xem giao diện trong trình duyệt
npm run lint        # chạy oxlint
```

## Build app Android

### Yêu cầu

- Node.js 20+
- JDK 21 (Temurin khuyến nghị)
- Android SDK (qua Android Studio, hoặc `cmdline-tools` + license đã accept)

### Build local

```bash
npm run build            # build web trước, tạo dist/
npx cap sync android      # copy dist/ vào android/app/src/main/assets
cd android
./gradlew assembleDebug   # ra file APK debug
```

File APK sau khi build nằm ở:
`android/app/build/outputs/apk/debug/app-debug.apk`

Đây là APK **debug**, tự ký bằng debug keystore — cài trực tiếp lên máy/emulator được nhưng không dùng để phát hành lên Play Store. Muốn build bản `release` cần cấu hình thêm signing key (không có sẵn trong repo).

Thư mục `android/` là project Gradle được Capacitor sinh ra và commit vào repo (theo khuyến nghị chính thức của Capacitor để dễ tùy biến native code). Sau khi thay đổi code web, luôn chạy lại `npx cap sync android` để đồng bộ.

## CI/CD

Workflow `.github/workflows/android.yml` chạy khi push vào `master` (hoặc kích hoạt tay): build web, sync vào Android project, chạy `./gradlew assembleDebug`, rồi upload file APK làm artifact của workflow run (tab **Actions** → chọn run → mục **Artifacts**, tên `counter-app-debug-apk`).

## Dependencies

Toàn bộ thư viện npm và Gradle/Android đều là gói chính thức, có nguồn gốc rõ ràng (Meta/React, Ionic/Capacitor, Vite, Google AndroidX, Microsoft TypeScript...), không có gói lạ hay bị deprecated. Chạy `npm audit` định kỳ để kiểm tra lỗ hổng bảo mật.
