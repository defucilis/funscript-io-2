const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: [
                "'Exo 2'",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
            serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
            mono: [
                "JetBrains Mono",
                "ui-monospace",
                "SFMono-Regular",
                "Menlo",
                "Monaco",
                "Consolas",
                "Liberation Mono",
                "Courier New",
                "monospace",
            ],
        },
        extend: {
            colors: {
                primary: colors.rose,
                secondary: colors.orange,
                neutral: colors.neutral,
                gray: colors.neutral,
            },
            height: {
                header: "2.5rem",
                mobileHeader: "4.5rem",
            },
            minHeight: theme => ({
                main: `calc(100vh - ${theme("height.header")})`,
                mobilemain: `calc(100vh - ${theme("height.mobileHeader")})`,
                48: "12rem",
            }),
            inset: theme => ({
                main: `${theme("height.header")}`,
                mobilemain: `${theme("height.mobileHeader")}`,
            }),
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
