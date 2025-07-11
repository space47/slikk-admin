/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Select } from '@/components/ui'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageNameTypes } from '@/store/types/pageSettings.types'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
}

const AddSubPageNameModal = ({ dialogIsOpen, setIsOpen }: props) => {
    const [inputValue, setInputvalue] = useState('')
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])

    const [pageValue, setPageValue] = useState<any>()

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 100,
    })

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [pageNames, isPageNamesSuccess])

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        const body = {
            name: inputValue,
            page: pageValue?.id,
        }
        try {
            const response = await axioisInstance.post(`/subpage`, body)
            notification.success({
                message: response?.data?.message || 'Successfully added a new sub page',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add new sub page',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} width={500}>
                <h5 className="mb-4 text-red-500">Add New Sub Page</h5>
                <div className="flex flex-col gap-4 mt-2 mb-7">
                    <input
                        value={inputValue}
                        name="name"
                        type="search"
                        className="rounded-xl"
                        placeholder="Enter Name"
                        onChange={(e) => setInputvalue(e.target.value)}
                    />
                </div>
                <div>
                    <Select
                        isClearable
                        className="w-full"
                        options={pageNamesData}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        onChange={(newVal) => {
                            setPageValue(newVal)
                        }}
                    />
                </div>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Add
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

interface props {}

export default AddSubPageNameModal
