# Face Verify Mobile

React Native / Expo dev-client prototype for face verification liveness detection.
It uses Vision Camera with a native MediaPipe Face Landmarker frame processor as
the face-tracking layer.

This project is for academic/demo use only. Do not use it as production identity
security without a real security review, anti-spoofing hardening, and backend
verification.

## What The App Does

- Opens a selfie verification screen.
- Detects whether a face is visible and centered.
- Shows a checkmark after each completed instruction.
- Checks head movement to the left and right.
- Asks the user to face forward and stay still.
- Shows a visible 3-second countdown while the face remains centered and stable.
- Automatically captures a selfie when the countdown completes.
- Marks the session as verified after the selfie is captured.

## Important: Expo Go Is Not Supported

This app uses native camera and MediaPipe frame-processing modules. It must run
with a custom Expo development client / native Android build.

Use this flow:

```text
install dependencies -> configure Android SDK -> build debug APK -> install APK -> start Metro -> open app
```

## Requirements

Install these before running the project:

- Node.js LTS with npm
- Android Studio
- Android SDK installed from Android Studio
- Android SDK Platform Tools, including `adb`
- JDK 17, or Android Studio's bundled JDK
- Android phone with USB debugging enabled

The instructions below are written for Windows PowerShell because this project
currently includes a Windows build helper script.

## 1. Install Android Studio And The Android SDK

1. Install Android Studio.
2. Open Android Studio.
3. Go to **More Actions** > **SDK Manager**.
4. In **SDK Platforms**, install a recent Android SDK platform.
5. In **SDK Tools**, install:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools
   - Android Emulator, optional if you only use a real phone
6. Note your Android SDK path.

Common Windows SDK path:

```text
C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

For the current machine, it is usually:

```text
C:\Users\daven\AppData\Local\Android\Sdk
```

## 2. Clone And Install Project Dependencies

```powershell
cd C:\Projects\faceverify-mobile
npm install
```

Useful scripts:

```powershell
npm run android:build
npm run android
npm run start
npm run typecheck
```

## 3. Point Gradle To The Android SDK

Check whether this file exists:

```text
android\local.properties
```

If it does not exist, create it and add your SDK path:

```properties
sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

Example for this machine:

```properties
sdk.dir=C\:\\Users\\daven\\AppData\\Local\\Android\\Sdk
```

`local.properties` is local machine configuration and should not be committed.

## 4. Check JDK 17

The build needs Java 17. The helper script `scripts\android-build.ps1` looks for
the JDK in this order:

1. `JAVA_HOME`
2. `.tools\jdk-17.0.19+10`
3. `C:\Program Files\Android\Android Studio\jbr`

If your build cannot find Java, install Android Studio or JDK 17, then set
`JAVA_HOME`:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
```

Expected result: Java 17.

## 5. Enable USB Debugging On Your Phone

1. On the phone, open **Settings**.
2. Go to **About phone**.
3. Tap **Build number** 7 times to enable Developer Options.
4. Go back to **Settings**.
5. Open **Developer options**.
6. Turn on **USB debugging**.
7. Connect the phone to the PC with USB.
8. When the phone asks **Allow USB debugging?**, tap **Allow**.

## 6. Confirm The Phone Is Connected

If `adb` is already in your PATH:

```powershell
adb devices
```

If `adb` is not in your PATH, use the full Android SDK path:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

Expected result:

```text
List of devices attached
YOUR_DEVICE_ID    device
```

If the device says `unauthorized`, unlock the phone and accept the USB debugging
popup.

## 7. Build The Android Debug APK

Use the included helper script:

```powershell
npm run android:build
```

The debug APK is created here:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## 8. Install The APK On The Phone

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
```

Expected result:

```text
Success
```

## 9. Start Metro And Open The App

Start Metro on port `8082`:

```powershell
npx expo start --dev-client --port 8082 --clear
```

In another PowerShell window, forward the phone to Metro:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8082 tcp:8082
```

Open **Face Verify** on the phone.

When Android asks for camera permission, allow it.

## Daily Development Run Loop

After first-time setup, this is the usual flow:

```powershell
cd C:\Projects\faceverify-mobile
npm run android:build
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8082 tcp:8082
npx expo start --dev-client --port 8082 --clear
```

For JavaScript-only changes, you usually do not need to rebuild the APK. Keep
Metro running and reload the app.

Rebuild the APK after changing native files, Android configuration, native
dependencies, Expo plugins, or package versions that affect native code.

## Running Checks

Run TypeScript checks:

```powershell
npm run typecheck
```

Build the Android APK:

```powershell
npm run android:build
```

## How To Use The Liveness Screen In Another App

The main screen is:

```text
src\screens\LivenessScreen.tsx
```

The liveness flow is split into small modules:

- `src\camera\FaceCamera.tsx` - camera preview and MediaPipe frame processor wiring
- `src\face\mediapipeFaceTracker.ts` - adapts MediaPipe Face Landmarker data into liveness landmarks
- `src\face\types.ts` - shared face and landmark types
- `src\liveness\livenessRules.ts` - head movement, centering, and stillness rules
- `src\liveness\livenessMachine.ts` - step-by-step verification state machine
- `src\screens\LivenessScreen.tsx` - app screen and UI wiring

To integrate the prototype into another React Native app:

1. Install the same camera/native dependencies from `package.json`.
2. Configure camera permission in the target app.
3. Copy `android\app\src\main\assets\face_landmarker.task` into the target app's
   Android assets folder.
4. Copy the `src\camera`, `src\face`, `src\liveness`, `src\ui`, and screen code
   you need.
5. Render `LivenessScreen` or wire `FaceCamera` and `livenessMachine` into your
   own screen.
6. Use the verification result from the liveness state machine as your app's
   local demo result.

For production, send the result to a backend and verify it server-side. A local
`verified: true` state can be modified by a determined attacker.

## Troubleshooting

### App Opens But Cannot Connect To Metro

Run:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8082 tcp:8082
```

Then restart Metro:

```powershell
npx expo start --dev-client --port 8082 --clear
```

### `adb devices` Shows `unauthorized`

Unlock the phone, accept the USB debugging popup, then run:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

If the popup does not appear, disable and re-enable USB debugging.

### Build Cannot Find The Android SDK

Create or fix:

```text
android\local.properties
```

It should contain:

```properties
sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

### Build Cannot Find Java

Install Android Studio or JDK 17, then set `JAVA_HOME`:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### Camera Permission Is Denied

On the phone, open:

```text
Settings -> Apps -> Face Verify -> Permissions -> Camera -> Allow
```

Then reopen the app.

## Notes

The app uses the bundled MediaPipe model asset:

```text
android\app\src\main\assets\face_landmarker.task
```

The liveness rules use canonical MediaPipe Face Mesh landmark indexes, so the
same head-turn, centering, and stillness checks can keep working even if the
camera implementation is changed later.
