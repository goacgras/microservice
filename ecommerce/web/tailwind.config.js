module.exports = {
    //for tree shaking (delete unused css classes on production)
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            body: ["Ubuntu"],
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
