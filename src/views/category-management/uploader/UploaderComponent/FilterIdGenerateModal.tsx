import CommonFilterSelect from '@/common/ComonFilterSelect'
import { Dialog } from '@/components/ui'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
}

const FilterIdGenerateModal = ({ isOpen, setIsOpen }: props) => {
    const [filterId, setFilterId] = useState<string>()
    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        notification.success({ message: `Copied id: ${id}` })
    }

    const handleSubmit = () => {}
    return (
        <div>
            <Dialog isOpen={isOpen} width={800} onClose={() => setIsOpen(false)}>
                <Formik initialValues={{}} onSubmit={handleSubmit}>
                    {() => (
                        <Form>
                            <CommonFilterSelect filterId={filterId} setFilterId={setFilterId} customClass="xl:w-[300px]" />
                            {filterId && (
                                <div className="flex gap-5 mt-10">
                                    <div className="font-bold">Filter ID is : {filterId}</div>
                                    <div>
                                        <AiOutlineCopy
                                            className="text-gray-500 cursor-pointer text-xl"
                                            onClick={() => handleCopy(filterId!)}
                                        />
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default FilterIdGenerateModal
