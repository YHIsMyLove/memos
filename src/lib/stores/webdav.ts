import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { type WebDAVClient, createClient } from "webdav";

export interface WebDAVConfig {
    url: string;
    username: string;
    password: string;
}

const WEBDAV_CONFIG_KEY = 'memos-webdav-config';
let Client: WebDAVClient | null = null;

function loadFromStorage(): WebDAVConfig {
    if (!browser) return { url: '', username: '', password: '' };

    try {
        const saved = localStorage.getItem(WEBDAV_CONFIG_KEY);
        if (!saved) return { url: '', username: '', password: '' };

        return JSON.parse(saved);
    } catch {
        return { url: '', username: '', password: '' };
    }
}

function saveToStorage(config: WebDAVConfig) {
    if (!browser) return;
    localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(config));
}

function createWebDAVStore() {
    const { subscribe, set, update } = writable<WebDAVConfig>(loadFromStorage());

    function createWebdavClient(config: WebDAVConfig) {
        Client = Client ?? createClient(config.url, {
            username: config.username,
            password: config.password
        });

    }

    return {
        subscribe,

        setConfig: (config: Partial<WebDAVConfig>) => {
            update(current => {
                const newConfig = { ...current, ...config };
                saveToStorage(newConfig);
                return newConfig;
            });
        },

        testConnection: async (config: WebDAVConfig) => {
            if (!config.url || !config.username || !config.password) {
                throw new Error('请先完成WebDAV配置');
            }
            try {
                createWebdavClient(config);
                console.log(Client);
                const directoryItems = await Client?.getDAVCompliance("/memos");
                if (!directoryItems) {
                    throw new Error('无法连接到WebDAV');
                }
                return true;
            } catch (error) {
                console.error('WebDAV connection error:', error);
                throw new Error('连接失败，请检查配置是否正确');
            }
        },

        backup: async (data: any, config: WebDAVConfig) => {
            if (!config.url || !config.username || !config.password) {
                throw new Error('请先完成WebDAV配置');
            }

            const backupData = JSON.stringify(data);
            const backupFileName = `memos-backup-${new Date().toISOString()}.json`;
            const backupUrl = `${config.url}/${backupFileName}`;

            try {
                const response = await fetch(backupUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${config.username}:${config.password}`),
                        'Content-Type': 'application/json'
                    },
                    body: backupData
                });

                if (!response.ok) {
                    throw new Error('备份失败');
                }

                return backupFileName;
            } catch (error) {
                console.error('Backup error:', error);
                throw new Error(`备份失败: ${error}`);
            }
        },

        restore: async (config: WebDAVConfig) => {
            if (!config.url || !config.username || !config.password) {
                throw new Error('请先完成WebDAV配置');
            }

            try {
                // First, list the directory to find backup files
                const response = await fetch(config.url, {
                    method: 'PROPFIND',
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${config.username}:${config.password}`),
                        'Depth': '1'
                    }
                });

                if (!response.ok) {
                    throw new Error('无法获取备份列表');
                }

                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, 'text/xml');
                const responses = xmlDoc.getElementsByTagNameNS('DAV:', 'response');

                let latestBackup = null;
                let latestDate = new Date(0);

                for (const response of responses) {
                    const href = response.getElementsByTagNameNS('DAV:', 'href')[0].textContent;
                    if (href && href.includes('memos-backup-')) {
                        const lastModified = response.getElementsByTagNameNS('DAV:', 'getlastmodified')[0].textContent;
                        const modDate = new Date(lastModified);
                        if (modDate > latestDate) {
                            latestDate = modDate;
                            latestBackup = href;
                        }
                    }
                }

                if (!latestBackup) {
                    throw new Error('没有找到备份文件');
                }

                // Get the latest backup file
                const fileResponse = await fetch(latestBackup, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${config.username}:${config.password}`)
                    }
                });

                if (!fileResponse.ok) {
                    throw new Error('无法读取备份文件');
                }

                const content = await fileResponse.text();
                return JSON.parse(content);
            } catch (error) {
                console.error('Restore error:', error);
                throw new Error(`恢复失败: ${error}`);
            }
        }
    };
}

export const webdav = createWebDAVStore();
