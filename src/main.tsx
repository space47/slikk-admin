/* eslint-disable import/default */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />,
    </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration)
            })
            .catch((registrationError) => {
                console.error('ServiceWorker registration failed:', registrationError)
            })
    })
}
