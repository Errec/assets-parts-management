/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
    theme: {
      extend: {
        colors: {
          'custom': {
            'blue': {
                100: '#55A6FF',
                200: '#2188FF',
                300: '#023B78',
                400: '#17192D',
            },
            'custom-green':'#52C41A',
            'custom-red':'#ED3833',
          },
      },
    },
    plugins: [],
  }
}