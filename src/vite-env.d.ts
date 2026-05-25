/// <reference types="vite/client" />

// interface ImportMetaEnv {
//     readonly VITE_BACKEND_URI: string
//     // more env variables...
// }

// interface ImportMeta {
//     readonly env: ImportMetaEnv
// }

// Development runtime config utilities
interface Window {
    setBackendURI?: (uri: string) => void
    resetBackendURI?: () => void
    getBackendInfo?: () => { current: string; default: string; source: string }
}
