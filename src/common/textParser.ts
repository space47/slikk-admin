export const textParser = <T extends string>(value: T) => {
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(value, 'text/html')

    // Replace line break tags with spaces
    htmlDoc.querySelectorAll('br').forEach((br) => br.replaceWith(' '))
    htmlDoc.querySelectorAll('p, div').forEach((el) => el.insertAdjacentText('afterend', ' '))

    const plainTextValue = htmlDoc.body.textContent || ''

    return plainTextValue.replace(/\s+/g, ' ').trim()
}
