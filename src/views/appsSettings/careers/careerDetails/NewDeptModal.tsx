/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import AddDepartment from './AddDepartment'
import EditDepartment from './EditDepartment'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (value: boolean) => void
}

const NewDeptModal = ({ dialogIsOpen, setIsOpen }: Props) => {
    const [tabSelect, setTabSelect] = useState('add')
    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} width={1300}>
                <h5 className="mb-4">Department Management</h5>
                <div className="flex gap-10 justify-start mb-5">
                    <div
                        className={`flex  cursor-pointer ${tabSelect === 'add' ? ' border-b-4 border-black text-green-500' : ''}`}
                        onClick={() => handleSelectTab('add')}
                    >
                        <span className="text-xl font-bold">Add Departments</span>
                    </div>
                    <div
                        className={`flex   cursor-pointer  ${tabSelect === 'edit' ? ' border-b-4 border-black text-green-500' : ''}`}
                        onClick={() => handleSelectTab('edit')}
                    >
                        <span className="text-xl font-bold">Edit Departments</span>
                    </div>
                </div>

                {tabSelect === 'add' && <AddDepartment setIsOpen={setIsOpen} />}
                {tabSelect === 'edit' && (
                    <>
                        <EditDepartment setIsOpen={setIsOpen} />
                    </>
                )}
            </Dialog>
        </div>
    )
}

export default NewDeptModal
