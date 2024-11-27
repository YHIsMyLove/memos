import { BaseDirectory, create, readTextFile, writeTextFile, readDir, remove, type DirEntry } from '@tauri-apps/plugin-fs';
import { isWeb } from '$lib/env';

const STORAGE_KEY_PREFIX = 'memos_note_';

class FileHelper {
    static async createFile(path: string, content: string): Promise<void> {
        if (isWeb) {
            // 在网页端使用 localStorage
            const key = STORAGE_KEY_PREFIX + path;
            localStorage.setItem(key, JSON.stringify({
                content,
                timestamp: Date.now()
            }));
            return;
        }

        // 在桌面端使用 Tauri API
        const dirs = path.split('/');
        dirs.pop(); // 移除文件名
        const dirPath = dirs.join('/');

        try {
            // 确保目录存在
            await create(dirPath, { baseDir: BaseDirectory.Document });
            // 写入文件
            await writeTextFile(path, content, { baseDir: BaseDirectory.Document });
        } catch (error) {
            console.error('Failed to create file:', error);
            throw error;
        }
    }

    static async readFile(path: string) {
        if (isWeb) {
            // 从 localStorage 读取
            const key = STORAGE_KEY_PREFIX + path;
            const data = localStorage.getItem(key);
            if (data) {
                const { content } = JSON.parse(data);
                return content;
            }
            return '';
        }

        // 从文件系统读取
        try {
            return await readTextFile(path, { baseDir: BaseDirectory.Document });
        } catch (error) {
            console.error('Failed to read file:', error);
            throw error;
        }
    }

    static async listFiles(directory: string, recursive: boolean = false): Promise<string[]> {
        if (isWeb) {
            // 从 localStorage 获取所有笔记
            const prefix = STORAGE_KEY_PREFIX + directory;
            const files: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    files.push(key.replace(STORAGE_KEY_PREFIX, ''));
                }
            }
            return files.sort((a, b) => {
                const aData = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + a) || '{}');
                const bData = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + b) || '{}');
                return (bData.timestamp || 0) - (aData.timestamp || 0);
            });
        }

        // 使用 Tauri API 列出文件
        try {
            const entries = await readDir(directory, { baseDir: BaseDirectory.Document });
            return entries
                .filter(entry => !entry.isDirectory)
                .map(entry => entry.name)
                .sort((a, b) => b.localeCompare(a));
        } catch (error) {
            console.error('Failed to list files:', error);
            return [];
        }
    }

    static async deleteFile(path: string): Promise<void> {
        if (isWeb) {
            // 从 localStorage 删除
            const key = STORAGE_KEY_PREFIX + path;
            localStorage.removeItem(key);
            return;
        }

        // 使用 Tauri API 删除文件
        try {
            await remove(path, { baseDir: BaseDirectory.Document });
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw error;
        }
    }
}

export default FileHelper;
