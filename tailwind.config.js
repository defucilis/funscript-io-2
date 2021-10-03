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
                main: `calc(100vh - ${theme("height.header")})`,
                mobilemain: `calc(100vh - ${theme("height.mobileHeader")})`,
                48: "12rem",
            }),
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
