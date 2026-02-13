import { notification } from 'antd'

export const handlePhoneInputValidation = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\D/g, '')

    if (value.length > 10) {
        notification.warning({ message: 'Not more than 10 digits are allowed' })
    }

    e.currentTarget.value = value.slice(0, 10)
}
