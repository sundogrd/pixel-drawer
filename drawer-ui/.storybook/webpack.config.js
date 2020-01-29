const path = require('path');
module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve('awesome-typescript-loader'),
            },
            // Optional
            {
                loader: require.resolve('react-docgen-typescript-loader'),
            },
        ],
    });
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.alias = Object.assign(config.resolve.alias, {
        '@': path.resolve(__dirname, '..'),
    });

    // postcss support
    config.module.rules.push({
        test: /\.css$/,
        use: [
            // Loader for webpack to process CSS with PostCSS
            {
                loader: 'postcss-loader',
                options: {
                    /*
                Enable Source Maps
               */
                    sourceMap: true,
                    /*
                Set postcss.config.js config path && ctx
               */
                    config: {},
                },
            },
        ],
    });
    return config;
};
