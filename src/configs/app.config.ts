export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: 'https://dev-api.slikk.club',
    authenticatedEntryPath: '/app/sales/dashboard',
    unAuthenticatedEntryPath: '/auth-two-factor',
    tourPath: '/app/account/kyc-form',
    locale: 'en',
    enableMock: false,
}

export default appConfig
