import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Modal } from 'antd'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    task_id: any
}

const QcDetailsModal = ({ dialogIsOpen, setIsOpen, task_id }: Props) => {
    const [taskData, setTaskData] = useState<any>()
    const [images, setImages] = useState<string[]>([])

    const fetchTableData = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/slikk/task?task_id=${task_id}`)
            const data = response.data.data
            setTaskData(data)

            // Extract and set images from all slikklogistic_item entries
            if (data.slikklogistic_item && data.slikklogistic_item.length > 0) {
                const allImages: string[] = []
                data.slikklogistic_item.forEach((item: any) => {
                    if (item.product_images) {
                        const imageArray = item.product_images.split(',')
                        allImages.push(...imageArray)
                    }
                })
                setImages(allImages)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (task_id) {
            fetchTableData()
        }
    }, [task_id])

    const onDialogClose = (e: MouseEvent) => {
        setIsOpen(false)
    }

    return (
        <div className="">
            <Modal
                open={dialogIsOpen}
                onOk={onDialogClose}
                onCancel={onDialogClose}
                className="z-1000 h-auto w-auto xl:h-[700px] overflow-y-scroll scrollbar-hide"
            >
                {images?.length > 0 ? (
                    <Splide options={{ rewind: true }} aria-label="Image carousel">
                        {images?.map((imageUrl, index) => (
                            <SplideSlide key={index}>
                                <div className="flex items-center justify-center h-[600px]">
                                    <img src={imageUrl} alt={`Image ${index}`} className="w-[550px] h-[550px] object-contain" />
                                </div>
                            </SplideSlide>
                        ))}
                    </Splide>
                ) : (
                    <p>No images available 😊</p>
                )}
            </Modal>
        </div>
    )
}

export default QcDetailsModal
