/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(0 0% 100%)",
                foreground: "hsl(222.2 84% 4.9%)",
                border: "hsl(214.3 31.8% 91.4%)",
                input: "hsl(214.3 31.8% 91.4%)",
                ring: "hsl(222.2 84% 4.9%)",
                card: "hsl(0 0% 100%)",
                "card-foreground": "hsl(222.2 84% 4.9%)",
                "muted-foreground": "hsl(215.4 16.3% 46.9%)",
                accent: "hsl(210 40% 96%)",
                "accent-foreground": "hsl(222.2 84% 4.9%)",
                primary: {
                    DEFAULT: "hsl(221.2 83.2% 53.3%)",
                    foreground: "hsl(210 40% 98%)",
                },
                secondary: {
                    DEFAULT: "hsl(210 40% 96%)",
                    foreground: "hsl(222.2 84% 4.9%)",
                },
                destructive: {
                    DEFAULT: "hsl(0 84.2% 60.2%)",
                    foreground: "hsl(210 40% 98%)",
                },
                muted: {
                    DEFAULT: "hsl(210 40% 96%)",
                    foreground: "hsl(215.4 16.3% 46.9%)",
                },
            },
        },
    },
    plugins: [],
}