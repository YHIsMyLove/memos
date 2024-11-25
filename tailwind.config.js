/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      "primary": "#121212",
      "primary-content": "#d9d9d9",
      "secondary": "#202020",
      "secondary-content": "#9D9D9D",
      "info": "#3A4359",
      "info-content": "#2B88D8",
      "accent": "#397354",
      "accent-content": "#d6e2da",
      "success": "#00f38c",
      "success-content": "#001407",
      "warning": "#ffa900",
      "warning-content": "#160a00",
      "error": "#ff0063",
      "error-content": "#160003",
      green: {
        100: '#B3DB61',
        200: '#CDE460',
        300: '#6ECC8E',
        400: '#539E73',
        500: '#2C7339',
      },
    }
  },
  plugins: [],
}

