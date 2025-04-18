export const textParser = (value: any) => {
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(value, 'text/html')
    const plainTextValue = htmlDoc.body.textContent || ''
    return plainTextValue
}
