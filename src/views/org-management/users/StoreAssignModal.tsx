import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
}

const StoreAssignModal = ({ dialogIsOpen, setIsOpen }: props) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">Dialog Title</h5>

                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Okay
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default StoreAssignModal
