import { platform, type Platform } from '@tauri-apps/plugin-os';

let _isWeb = false;
let _isWindows = false;
let _isMobile = false;
try {
    const currentPlatform: Platform = platform();
    _isMobile = currentPlatform === "android" || currentPlatform === 'ios';
    _isWindows = currentPlatform === 'windows' || currentPlatform === 'macos' || currentPlatform === 'linux';
} catch {
    _isWeb = true;
}

export const isWeb = _isWeb;
export const isWindows = _isWindows;
export const isMobile = _isMobile;
