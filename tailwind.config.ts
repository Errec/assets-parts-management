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
                100: '#55A6FF',
                200: '#2188FF',
                300: '#023B78',
                400: '#17192D',
            },
            'tractian-green':'#52C41A',
            'tractian-red':'#ED3833',
          },
      },
    },
    plugins: [],
  }
}