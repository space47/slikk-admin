export const hexToRgbTuple = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
}

export const rgbTupleToHex = (rgb: number[]): string => {
    if (!rgb || rgb.length < 3) return '#000000'
    return (
        '#' +
        rgb
            .slice(0, 3)
            .map((x) => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            })
            .join('')
    )
}

export const hexToRgbaTuple = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha] : [0, 0, 0, alpha]
}

export const rgbaTupleToAlpha = (rgba: number[]): number => {
    if (!rgba || rgba.length < 4) return 255
    return rgba[3]
}
