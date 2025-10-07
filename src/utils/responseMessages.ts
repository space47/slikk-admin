/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'
import { AxiosError, AxiosResponse } from 'axios'

export const successMessage = (res: AxiosResponse<any, any>) => {
    const msg = res?.data?.message || res?.data?.data?.message || res?.message || 'Operation successful'

    notification.success({
        message: 'Success',
        description: msg,
        placement: 'topRight',
    })
}

export const errorMessage = (err: AxiosError<any, any>) => {
    const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to perform action'

    notification.error({
        message: 'Error',
        description: msg,
        placement: 'topRight',
    })
}
