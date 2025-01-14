import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
}

const AddPageNameModal = ({ dialogIsOpen, setIsOpen }: props) => {
    const [inputValues, setInputvalues] = useState({
        name: '',
        display_name: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputvalues({
            ...inputValues,
            [name]: value,
        })
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        const body = {
            name: inputValues?.name,
            display_name: inputValues?.display_name,
        }
        try {
            const response = await axioisInstance.post(`/page`, body)
            notification.success({
                message: response?.data?.message || 'Successfully added a new page',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add new page',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4 text-red-500">Add New Page</h5>
                <div className="flex flex-col gap-4">
                    <input
                        value={inputValues.name}
                        onChange={handleInputChange}
                        name="name"
                        type="search"
                        className="rounded-xl"
                        placeholder="Enter Name"
                    />
                    <input
                        value={inputValues.display_name}
                        name="display_name"
                        type="search"
                        className="rounded-xl"
                        onChange={handleInputChange}
                        placeholder="Enter Display Name"
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

export default AddPageNameModal
