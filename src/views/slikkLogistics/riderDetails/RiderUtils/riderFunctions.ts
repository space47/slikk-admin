/* eslint-disable @typescript-eslint/no-explicit-any */

import { notification } from 'antd'

export const handleCopyLink = () => {
    navigator.clipboard.writeText('https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Rider+App/rider-app-new.apk')
    notification.success({ message: 'Copied' })
}
