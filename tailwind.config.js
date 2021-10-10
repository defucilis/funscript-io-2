const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: colors.rose,
                secondary: colors.orange,
                neutral: colors.gray,
            },
            height: {
                header: "2.5rem",
                mobileHeader: "4.5rem",
            },
            minHeight: theme => ({
                main: `calc(100vh - ${theme("height.header")} - 1rem)`,
                mobilemain: `calc(100vh - ${theme("height.mobileHeader")} - 1rem)`,
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
