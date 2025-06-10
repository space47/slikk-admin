import { useEffect, useState } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Modal } from 'antd'
import { CiImageOff } from 'react-icons/ci'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    task_id: any
    sku: string
}

const QcDetailsModal = ({ dialogIsOpen, setIsOpen, task_id, sku }: Props) => {
    const [logisticData, setLogisticData] = useState<any>({})
    const [images, setImages] = useState<string[]>([])
    console.log('sku inside modal', sku)

    const fetchTableData = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/slikk/task?task_id=${task_id}`)
            const data = response.data.data
            setLogisticData(data?.slikklogistic_item)

            if (data.slikklogistic_item && data.slikklogistic_item.length > 0) {
                const allImages: string[] = []
                const filteredData = data.slikklogistic_item.find((item) => item.sku === sku)
                const imageArray = filteredData?.product_images ? filteredData?.product_images?.split(',') : ''
                allImages.push(...imageArray)
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

    const onDialogClose = () => {
        setIsOpen(false)
    }
    console.log('images', images)

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
                    <p className="text-xl flex flex-col items-center justify-center">
                        <span>
                            <CiImageOff className="text-4xl" />
                        </span>
                        No Image Available
                    </p>
                )}
                {logisticData?.qc_detail?.length > 0 && (
                    <>
                        <div className="mt-4 mb-2">
                            {logisticData?.qc_detail?.map((item: any, index: number) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <p className="text-lg font-semibold">{item?.question}</p>
                                    <p className="text-md text-red-500"> {item?.status}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default QcDetailsModal
