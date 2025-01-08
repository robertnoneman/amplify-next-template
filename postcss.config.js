module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
    plugins: [
      [
        "@csstools/postcss-global-data",
        {
          files: ["once-ui/styles/breakpoints.scss"],
        },
      ],
      "postcss-custom-media",
      "tailwindcss",
      "postcss-flexbugs-fixes",
      [
        "postcss-preset-env",
        {
          autoprefixer: {
            flexbox: "no-2009",
          },
          stage: 3,
          features: {
            "custom-properties": false,
          },
        },
      ],
    ],
  };