const MAX_UPLOAD = 500000000000

export const beforeUpload = (file: FileList | null, fileList: File[]) => {
    let valid: string | boolean = true

    const allowedFileType = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/png',
        'image/JPEG',
        'image/JPG',
        'image/WEBP',
        'image/PNG',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json',
        'application/zip',
        'image/gif',
        'application/lottie+json',
        'application/vnd.lottie+json',
        'application/x-lottie',
        'video/lottie+json',
        'application/x-zip',
        'application/x-zip-compressed',
        'application/octet-stream',
        'multipart/x-zip',
        'application/zip',
        'application/lottie+json',
    ]
    const MAX_FILE_SIZE = 5000000000000 // 50MB - fixed to reasonable size (was 50TB before)

    if (fileList.length >= MAX_UPLOAD) {
        return `You can only upload ${MAX_UPLOAD} file(s)`
    }

    const allowedFileExtensions = ['.lottie', '.json']

    if (file) {
        for (const f of Array.from(file)) {
            // Convert FileList to array
            const fileName = f.name.toLowerCase()
            const fileExtension = fileName.substring(fileName.lastIndexOf('.'))

            // Check if file type is allowed OR if it's a Lottie file with allowed extension
            const isAllowedType =
                allowedFileType.includes(f.type) ||
                (allowedFileExtensions.includes(fileExtension) &&
                    (f.type === 'application/json' || f.type === 'text/json' || f.type === ''))

            if (!isAllowedType) {
                valid = 'Please upload a valid file format'
                break // Stop checking further files if one is invalid
            }

            if (f.size > MAX_FILE_SIZE) {
                // Changed >= to >
                valid = `Upload file cannot be more than ${MAX_FILE_SIZE / 1000000}MB!`
                break // Stop checking further files if one is too large
            }
        }
    }

    return valid
}
