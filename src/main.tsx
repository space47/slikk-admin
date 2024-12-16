/* eslint-disable import/default */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered', registration.scope)
                if (navigator.serviceWorker.controller) {
                    console.log('Service Worker is active ')
                } else {
                    console.log('Service Worker is not registered ')
                }
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error)
            })
    })
} else {
    console.warn('Service Workers are not supported in this browser.')
}
