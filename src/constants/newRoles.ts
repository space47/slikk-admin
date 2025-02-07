import axios from 'axios'

let userRoles: string[] = []

export const fetchUserProfile = async () => {
    try {
        const response = await axios.get('/dashboard/user/profile', {})
        userRoles = response.data?.roles || []
    } catch (error) {
        console.error('Error fetching user profile:', error)
    }
}

fetchUserProfile()

export const hasRole = (role: string) => {
    return userRoles.includes(role)
}
