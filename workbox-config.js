module.exports = {
    globDirectory: './',
    globPatterns: ['**/*.{html,js,css,png,jpg,json}'],
    swDest: './service-worker.js',
    maximumFileSizeToCacheInBytes: 5000000, // 5MB
    runtimeCaching: [
        {
            urlPattern: /api/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 50,
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'image-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
            },
        },
    ],
}
