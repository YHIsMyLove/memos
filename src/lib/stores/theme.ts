import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'memos-theme';

function getSystemTheme(): 'light' | 'dark' {
    if (browser) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
}

function createThemeStore() {
    const { subscribe, set } = writable<Theme>(getInitialTheme());

    function applyTheme(theme: Theme) {
        const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(effectiveTheme);
    }

    if (browser) {
        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            const currentTheme = localStorage.getItem(THEME_KEY) as Theme;
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        });
    }

    return {
        subscribe,
        setTheme: (newTheme: Theme) => {
            if (browser) {
                localStorage.setItem(THEME_KEY, newTheme);
                applyTheme(newTheme);
                set(newTheme);
            }
        },
        initialize: () => {
            if (browser) {
                const theme = getInitialTheme();
                applyTheme(theme);
                set(theme);
            }
        }
    };
}

function getInitialTheme(): Theme {
    if (browser) {
        const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            return savedTheme;
        }
    }
    return 'system';
}

export const theme = createThemeStore();
