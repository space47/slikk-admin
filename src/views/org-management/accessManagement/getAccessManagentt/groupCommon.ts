export type GROUPTYPES = {
    id: number
    name: 'customer' | 'creator' | 'rider' | 'company_admin' | 'internal_user' | 'tech_support' | 'picker' | 'account'
}

export type USERGROUPDATA = {
    name: string
    mobile: string
    email: string
}
export type PERMISSIONGROUPDATA = {
    name: string
    codename: string
    id: number
}
