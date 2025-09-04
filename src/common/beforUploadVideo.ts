export const beforeVideoUpload = (file: FileList | null, fileList: File[]) => {
    let valid: string | boolean = true

    const allowedFileType = [
        'video/mp4',
        'video/m3u8',
        'video/mov',
        'video/flv',
        'video/avi',
        'video/wmv',
        'video/webm',
        'video/avchd',
        'video/3gp',
        'video/MOV',
        'video/quicktime',
        'application/lottie+json',
        'application/vnd.lottie+json',
        'application/x-lottie',
        'video/lottie+json',
        'application/x-zip',
        'application/x-zip-compressed',
        'application/octet-stream',
        'multipart/x-zip',
        'application/zip',
    ]
    const MAX_FILE_SIZE = 9000000000000000
    const MAX_UPLOAD = 70000000000000

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
