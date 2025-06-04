const CracoAlias = require("craco-alias");

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Ensure CSS is processed correctly
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      if (oneOfRule) {
        const cssRule = oneOfRule.oneOf.find(
          (rule) => rule.test && rule.test.toString().includes('css')
        );
        if (cssRule && cssRule.use) {
          cssRule.use.forEach((loader) => {
            if (loader.loader && loader.loader.includes('postcss-loader')) {
              loader.options = {
                ...loader.options,
                postcssOptions: {
                  plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                  ],
                },
              };
            }
          });
        }
      }
      
      // Production optimizations
      if (env === 'production') {
        // Enable aggressive code splitting
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            },
            // Separate large libraries
            recharts: {
              test: /[\\/]node_modules[\\/]recharts/,
              name: 'recharts',
              priority: 30,
              chunks: 'all'
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion/,
              name: 'framer-motion',
              priority: 30,
              chunks: 'all'
            },
            // Split Radix UI components
            radixui: {
              test: /[\\/]node_modules[\\/]@radix-ui/,
              name: 'radixui',
              priority: 30,
              chunks: 'all'
            },
            // Split React Spring (if still used)
            reactSpring: {
              test: /[\\/]node_modules[\\/]@react-spring/,
              name: 'react-spring',
              priority: 30,
              chunks: 'all'
            }
          }
        };
        
        // Enable module concatenation
        webpackConfig.optimization.concatenateModules = true;
        
        // Use terser for better minification
        webpackConfig.optimization.minimizer[0].options.terserOptions = {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
          },
          mangle: {
            safari10: true
          }
        };
      }
      
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.json"
      }
    }
  ],
  eslint: {
    enable: false
  }
};