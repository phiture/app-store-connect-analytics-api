import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: 'class', // Enable dark mode support
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./public/index.html",
    ],
    theme: {},
    plugins: [],
};
export default config;
