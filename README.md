# Face Verify Mobile

React Native / Expo dev-client prototype for face verification liveness detection. It uses Vision Camera plus a native ML Kit face detector as the working face-tracking layer for this capstone prototype.

This is for academic/demo use only, not production identity security.

## What It Does

- Shows a GCash-style selfie verification screen.
- Detects a visible centered face.
- Checks for one blink.
- Checks head turn left and right.
- Checks stillness for a few seconds.
- Returns `verified: true` after all steps pass.

## Requirements

- Node.js and npm
- Android Studio
- Android SDK installed through Android Studio
- JDK 17 or Android Studio's bundled JDK
- Android phone with USB debugging enabled

This app will not run in Expo Go because it uses native camera/frame-processing modules.

## First-Time Setup

Install dependencies:

```powershell
cd C:\Projects\faceverify-mobile
npm install
```

Make sure Android SDK is found. Create `android\local.properties` if it does not exist:

```properties
sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

For this machine, the path is usually:

```properties
sdk.dir=C\:\\Users\\daven\\AppData\\Local\\Android\\Sdk
```

## Enable USB Debugging

1. On your phone, open **Settings**.
2. Go to **About phone**.
3. Tap **Build number** 7 times to enable Developer Options.
4. Go back to **Settings**.
5. Open **Developer options**.
6. Turn on **USB debugging**.
7. Connect the phone to the PC with USB.
8. When the phone asks **Allow USB debugging?**, tap **Allow**.

## Check Phone Connection

Use the full `adb` path if `adb` is not in your PATH:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

Expected result:

```text
List of devices attached
YOUR_DEVICE_ID    device
```

If it says `unauthorized`, unlock your phone and accept the USB debugging popup.

## Build The APK

Use the helper script:

```powershell
npm run android:build
```

The APK will be created here:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## Install On Phone

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
```

Wait for:

```text
Success
```

## Start The App

Start Metro:

```powershell
npx expo start --dev-client --port 8082 --clear
```

Forward the phone to Metro:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8082 tcp:8082
```

Open **Face Verify** on the phone.

## Usual Run Loop

After the first setup, use this flow:

```powershell
cd C:\Projects\faceverify-mobile
npm run android:build
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8082 tcp:8082
npx expo start --dev-client --port 8082 --clear
```

## Project Structure

- `src/camera/FaceCamera.tsx` - camera preview and native face detector callback
- `src/face/mediapipeFaceTracker.ts` - adapts detected face data into liveness landmarks
- `src/liveness/livenessRules.ts` - blink, head movement, centering, and stillness rules
- `src/liveness/livenessMachine.ts` - step-by-step verification state machine
- `src/screens/LivenessScreen.tsx` - app screen and UI

## Notes

The face detector is a MediaPipe/Face Mesh alternative based on native ML Kit. The code keeps a `mediapipeFaceTracker` adapter so a true MediaPipe Face Landmarker frame-processor can be swapped in later without rewriting the liveness rules.
