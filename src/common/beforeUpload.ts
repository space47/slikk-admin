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
    ]
    const MAX_FILE_SIZE = 50000000000000

    if (fileList.length >= MAX_UPLOAD) {
        return `You can only upload ${MAX_UPLOAD} file(s)`
    }

    if (file) {
        for (const f of file) {
            if (!allowedFileType.includes(f.type)) {
                valid = 'Please upload a valid file format'
            }

            if (f.size >= MAX_FILE_SIZE) {
                valid = 'Upload image cannot more then 500kb!'
            }
        }
    }

    return valid
}
