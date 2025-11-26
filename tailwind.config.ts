import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a",
                foreground: "#e2e8f0",
                primary: {
                    DEFAULT: "#3b82f6",
                    hover: "#2563eb",
                },
                surface: {
                    DEFAULT: "#1e293b",
                    hover: "#334155",
                },
                border: "#334155",
            },
            borderRadius: {
                DEFAULT: "12px",
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
