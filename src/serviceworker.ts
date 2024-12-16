export default function serviceworker() {
    // Define the correct URL for the service worker
    const swUrl = `${import.meta.env.VITE_BACKEND_URI}/sw.js`

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker
                .register(swUrl, { scope: '/' }) // Ensure proper scope
                .then((registration) => {
                    console.log('Service Worker registration successful with scope: ', registration.scope)
                })
                .catch((err) => {
                    console.error('Failed to register Service Worker:', err)
                })
        })
    } else {
        console.log('Service Worker is not supported in this browser.')
    }
}
