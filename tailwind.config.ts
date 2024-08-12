/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
    theme: {
      extend: {
        colors: {
          'tractian': {
            'blue': {
                50: '#d8dfe6',
                100: '#55A6FF',
                200: '#2188FF',
                300: '#023B78',
                400: '#17192D',
            },
            'green':'#52C41A',
            'red':'#ED3833',
            'gray-50': '#E3EAEF',
            'gray-100': '#88929C',
          },
      },
    },
    plugins: [],
  }
}