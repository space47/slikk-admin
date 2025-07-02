export const textParser = <T extends string>(value: T) => {
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(value, 'text/html')
    const plainTextValue = htmlDoc.body.textContent || ''
    return plainTextValue
}
