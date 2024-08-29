export const formatDate = (backendDate: string) => {
    const date = new Date(backendDate)
    // Extract the year, month, and day
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    return formattedDate
}
