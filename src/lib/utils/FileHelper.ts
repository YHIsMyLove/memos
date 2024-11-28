import { BaseDirectory, create, readTextFile, writeTextFile, readDir, remove, type DirEntry, exists, mkdir } from '@tauri-apps/plugin-fs';
import { isWeb } from '$lib/env';
import { documentDir, join, dirname, appLocalDataDir } from '@tauri-apps/api/path';

const STORAGE_KEY_PREFIX = 'memos_note_';

class FileHelper {

    /**
     * 创建文件
     * @param path 
     * @param content 
     * @returns 
     */
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

        try {

            const baseDir = await appLocalDataDir();
            const absolutePath = await join(baseDir, path);
            const dir = await dirname(absolutePath);
            const dirExists = await exists(dir, { baseDir: BaseDirectory.AppLocalData });
            if (!dirExists) {
                await mkdir(dir, { baseDir: BaseDirectory.AppLocalData, recursive: true });
            }
            await writeTextFile(absolutePath, content, { baseDir: BaseDirectory.AppLocalData });
        } catch (error) {
            console.error('Failed to create file:', error);
            throw error;
        }
    }

    /**
     * 读取文件
     * @param path 
     * @returns 
     */
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
            const baseDir = await appLocalDataDir();
            const absolutePath = await join(baseDir, path);
            const fileExists = await exists(absolutePath, { baseDir: BaseDirectory.AppLocalData });
            if (!fileExists) {
                return '';
            }
            return await readTextFile(absolutePath, { baseDir: BaseDirectory.AppLocalData });
        } catch (error) {
            console.error('Failed to read file:', error);
            throw error;
        }
    }

    /**
     * 列出当前文件夹中的文件 
     * @param directory     
     * @param recursive 
     * @returns 
     */
    static async listFiles(directory: string): Promise<DirEntry[]> {
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
            return files.map(file => ({
                name: file,
                isFile: true,
                isDirectory: false,
                isSymlink: false
            }));
        }
        try {

            const baseDir = await appLocalDataDir();
            const absoluteDirectoryPath = await join(baseDir, directory);

            const directoryExists = await exists(absoluteDirectoryPath, { baseDir: BaseDirectory.AppLocalData });
            if (!directoryExists) {
                return [];
            }
            const entries = await readDir(absoluteDirectoryPath, { baseDir: BaseDirectory.AppLocalData });
            return entries;
        } catch (error) {
            console.error('Failed to list files:', error);
            return [];
        }
    }


    /**
     * 删除文件
     * @param path 
     * @returns 
     */
    static async deleteFile(path: string): Promise<void> {
        if (isWeb) {
            // 从 localStorage 删除
            const key = STORAGE_KEY_PREFIX + path;
            localStorage.removeItem(key);
            return;
        }

        // 使用 Tauri API 删除文件
        try {
            const baseDir = await appLocalDataDir();
            const absolutePath = await join(baseDir, path);
            const fileExists = await exists(absolutePath, { baseDir: BaseDirectory.AppLocalData });
            if (!fileExists) {
                return;
            }
            await remove(absolutePath, { baseDir: BaseDirectory.AppLocalData });
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw error;
        }
    }
}

export default FileHelper;
