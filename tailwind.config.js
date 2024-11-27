/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        "primary-content": 'var(--color-primary-content)',
        secondary: 'var(--color-secondary)',
        "secondary-content": 'var(--color-secondary-content)',
        accent: 'var(--color-accent)',
        "accent-content": 'var(--color-accent-content)',
        success: 'var(--color-success)',
        "success-content": 'var(--color-success-content)',
        warning: 'var(--color-warning)',
        "warning-content": 'var(--color-warning-content)',
        error: 'var(--color-error)',
        "error-content": 'var(--color-error-content)',
        info: 'var(--color-info)',
        "info-content": 'var(--color-info-content)',
      }
    }
  },
  plugins: [],
}
