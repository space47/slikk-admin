import { DevBackendSwitcher } from '@/components/DevBackendSwitcher'
import Layout from '@/components/layouts'
import Theme from '@/components/template/Theme'
import appConfig from '@/configs/app.config'
import store, { persistor } from '@/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './locales'
import mockServer from './mock'

const environment = process.env.NODE_ENV

if (appConfig.enableMock) {
    mockServer({ environment })
}

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Theme>
                        <Layout />
                    </Theme>
                </BrowserRouter>
                <DevBackendSwitcher />
            </PersistGate>
        </Provider>
    )
}

export default App
