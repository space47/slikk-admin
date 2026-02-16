import { notification } from 'antd'

export const handlePhoneInputValidation = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\D/g, '')

    if (value.length > 10) {
        notification.warning({ message: 'Not more than 10 digits are allowed' })
    }

    e.currentTarget.value = value.slice(0, 10)
}
export const handlePANandTANValidation = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toUpperCase()

    if (value.length > 10) {
        notification.warning({ message: 'Not more than 10 digits are allowed' })
    }

    e.currentTarget.value = value.slice(0, 10)
}

export const handleMaxInputValidation = (e: React.FormEvent<HTMLInputElement>, max: number, onlyNumber?: boolean) => {
    let value = e.currentTarget.value

    if (onlyNumber) {
        value = e.currentTarget.value.replace(/\D/g, '')
    }

    if (value.length > max) {
        notification.warning({ message: `Not more than ${max} digits are allowed` })
    }

    e.currentTarget.value = value.slice(0, max)
}
