
import { path } from "@tauri-apps/api";
import { exists, BaseDirectory, create, readTextFile, readDir, writeTextFile, remove, mkdir, type DirEntry } from "@tauri-apps/plugin-fs";

export interface DirEntryEx extends DirEntry {
    children?: Array<DirEntryEx>
}

export class FileHelper {
    static dirName(file: string) {
        return file.split("/").slice(0, -1).join("/")
    }
    static async fileExists(file: string) {
        return await exists(file, { baseDir: BaseDirectory.AppData })
    }
    static async deleteFile(file: string) {
        return await remove(file, { baseDir: BaseDirectory.AppData })
    }
    static async createDir(dir: string) {
        return await mkdir(dir, { baseDir: BaseDirectory.AppData, recursive: true })
    }
    static async createFile(file: string, content: string | null = null) {
        let fileHandle
        try {
            const baseDir = FileHelper.dirName(file)
            if (baseDir) {
                const baseDirExists = await FileHelper.fileExists(baseDir)
                if (!baseDirExists) {
                    await FileHelper.createDir(baseDir)
                }
            }
            fileHandle = await create(file, { baseDir: BaseDirectory.AppData })
            if (content) {
                await writeTextFile(file, content, { baseDir: BaseDirectory.AppData })
            }
        } catch (error) {
            console.error(error)
        }
        finally {
            await fileHandle?.close()
        }
    }
    static async readFile(file: string) {
        return await readTextFile(file, { baseDir: BaseDirectory.AppData })
    }

    static async getFiles(dir: string, recursive: boolean = false) {
        const hasDir = await FileHelper.fileExists(dir)
        if (!hasDir) return []
        const dirs: Array<DirEntryEx> = await readDir(dir, { baseDir: BaseDirectory.AppData })
        if (recursive) {
            let promises = []
            for (let index = 0; index < dirs.length; index++) {
                const dirInfo = dirs[index];
                if (dirInfo.isDirectory) {
                    dirInfo.children = []
                    const appDataDirPath = await path.appDataDir();
                    const fullDir = await path.join(appDataDirPath, dir, dirInfo.name)
                    const children = await FileHelper.getFiles(fullDir, recursive)
                    dirInfo.children.push(...children)
                }
            }
        }
        return dirs
    }
}