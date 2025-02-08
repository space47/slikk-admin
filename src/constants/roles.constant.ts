import { hasRole } from './newRoles'

export const ADMIN = 'admin'
export const USER = 'user'

export const RIDER = hasRole('rider') ? 'rider' : ''
export const CUSTOMER = hasRole('customer') ? 'customer' : undefined
