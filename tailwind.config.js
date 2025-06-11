/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			borderColor: ['focus-within'],
      ringWidth: ['focus-within'],
      ringColor: ['focus-within'],
      textColor: ['focus-within']
		},
	},
	plugins: [],
};
