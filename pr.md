# Pull Request: Profile Alignment, Avatar Picker, Camera Rotation Fix, Enhanced Chat Features, and View Profile Routing

## Summary of Changes
This pull request brings comprehensive improvements to user profile management, selfie liveness camera capture, multi-language internationalization, image attachment in chat, full-screen image viewing, animated emoji reactions, and seamless "View Profile" navigation routing across the application.

---

## 1. Commit History (Sequential 1-by-1 Commits)

```bash
0fd6a05 feat(i18n): update Tagalog, Cebuano, and English translations for profile and status settings
25c2b75 fix(profile): align profile row labels with icon containers and add camera avatar photo picker
a064d7e fix(id-modal): connect Take Photo and Upload Photo handlers with Expo ImagePicker
612e2e1 fix(camera): auto-rotate front camera selfie 180deg upright using Skia
1414958 feat(chat): add uncropped image attachments, full-screen zoom viewer, and animated emoji reactions
1b3a8f6 feat(chats): sync chat messages and active chat list state
c21be50 feat(navigation): route View Profile clicks and avatar taps directly to Personal Info tab
```

---

## 2. Key Features & Bug Fixes

### 🎨 Profile Row Alignment & Camera Photo Picker
- **Pixel-Perfect Alignment**: Wrapped row icons in a fixed `24px` centered container (`iconContainer`), establishing a 100% uniform vertical text alignment axis down the entire profile list.
- **Camera Avatar Badge**: Updated profile avatar badge to a camera icon (`camera`).
- **Device Photo Gallery Picker**: Integrated `expo-image-picker` so tapping profile pictures allows selecting and updating profile photos across the entire app.

### 📷 Camera & Selfie Orientation Correction
- **180° Skia Rotation**: Corrected Android front-camera upside-down image captures by running high-speed Skia canvas auto-rotation (`Skia.Data.fromURI(...)`).
- **ID Photo Modal**: Connected **Take Photo** and **Upload Photo** handlers with proper permissions and native gallery/camera invocation.

### 💬 Chat Enhancements (Images, Full-Screen Zoom & Reactions)
- **Uncropped Image Attachments**: Disabled forced square cropping (`allowsEditing: false`) and set `resizeMode="contain"` so full aspect ratio photos are sent in chat bubbles.
- **Messenger Full-Screen Zoom Viewer**: Tapping chat photos opens a dark full-screen image viewer modal.
- **Animated Emoji Reactions**:
  - Long-pressing any chat message triggers an animated pop-up pill (`Animated.spring` + `Animated.timing`) directly above the message.
  - Supports 5 emojis: ❤️ (**Heart**), 👍 (**Like**), 😂 (**Haha**), 😭 (**Sad**), and 😮 (**Wow**).
  - Tapping anywhere dismisses the reaction interface.
  - Selected reaction is rendered as a clean, containerless emoji on the bottom-right corner of the message bubble.

### 🧭 Navigation Routing
- **Direct "Personal Info" View**: Tapping **"View Profile"** or avatar/name headers across Home, Services, and Jobs screens now opens directly to the user's **Personal Info** tab.

---

## 3. Verification & Testing
- ✅ **Typecheck**: `npx tsc --noEmit` passed with 0 errors.
- ✅ **Android Runtime**: Verified on Expo Android emulator and device builds.
