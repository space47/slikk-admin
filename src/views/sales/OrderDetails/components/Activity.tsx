import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import Button from '@/components/ui/Button'
import React, { useState, useEffect } from 'react'
import { Modal, notification } from 'antd'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'

type Event = {
    timestamp: string
    status: string
}

type Payment = {
    amount: number
    mode: string
    transaction_time: string
}

type Product = {
    image: string
    quantity: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    name: string
    id: number
}

type ActivityProps = {
    data?: Event[]
    status: string
    product?: Product[]
    payment?: Payment
    invoice_id?: string
}

const Activity = ({
    data = [],
    status,
    product = [],
    payment,
    invoice_id,
}: ActivityProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<string>()
    const [fulfilledQuantities, setFulfilledQuantities] = useState<{
        [key: number]: number
    }>({})
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [action, setAction] = useState('')
    const [triggerApiCall, setTriggerApiCall] = useState<boolean>(false)
    const [triggerpackCall, setTriggerpackCall] = useState<boolean>(false)
    const [cancelCall, setCancelCall] = useState<boolean>(false)
    const navigate = useNavigate()

    const showModal = (content: string | undefined) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    const handleSelectChange = (id: number, value: string) => {
        setFulfilledQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: parseInt(value, 10),
        }))
    }

    // useEffect(() => {

    //     };
    // }, [handleOk]);

    const handleOk = () => {
        setAction('ACCEPTED')
        setTriggerApiCall(true)
    }

    // const handleCancel = () => {
    //     setIsModalOpen(false);
    // };

    useEffect(() => {
        if (triggerApiCall) {
            const sendApiRequest = async () => {
                try {
                    const data = Object.entries(fulfilledQuantities).reduce(
                        (acc, [id, quantity]) => {
                            if (quantity > 0) {
                                acc[id] = quantity
                            }
                            return acc
                        },
                        {} as { [key: number]: number },
                    )

                    const body = {
                        action,
                        data,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerApiCall(false)
                } catch (error) {
                    console.error(error)
                    setTriggerApiCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerApiCall, navigate])

    const handleCancel = () => {
        setAction('ACCEPTED')
        setCancelCall(true)
    }

    useEffect(() => {
        if (cancelCall) {
            const sendApiRequest = async () => {
                try {
                    const data = Object.entries(fulfilledQuantities).reduce(
                        (acc, [id, quantity]) => {
                            return acc
                        },
                        {} as { [key: number]: number },
                    )

                    const body = {
                        action,
                        data,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setCancelCall(false)
                } catch (error) {
                    console.error(error)
                    setCancelCall(false)
                }
            }
            sendApiRequest()
        }
    }, [cancelCall, navigate])

    // ..........................................................................................................

    const handlePack = () => {
        setAction('PACKED')
        setTriggerpackCall(true)
    }

    useEffect(() => {
        if (triggerpackCall) {
            const sendApiRequest = async () => {
                try {
                    const body = {
                        action,
                    }

                    const response = await axiosInstance.patch(
                        `merchant/order/${invoice_id}`,
                        body,
                    )
                    navigate(0)
                    console.log(response.data)
                    setIsModalOpen(false)
                    setTriggerpackCall(false)
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Order status updated successfully.',
                    })
                } catch (error: any) {
                    console.error(error)
                    const errorMessage =
                        error.response?.data?.message ||
                        'There was an error updating the order status. Please try again.'

                    // Display error notification
                    notification.error({
                        message: 'Error',
                        description: errorMessage,
                    })
                } finally {
                    setTriggerpackCall(false)
                }
            }
            sendApiRequest()
        }
    }, [triggerpackCall, navigate])

    const handleClose = () => {
        setIsModalOpen(false)
    }

    const getButtonAndModalContent = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    buttonText: 'ACCEPT/REJECT',
                }
            case 'ACCEPTED':
                return {
                    buttonText: 'PICK AND PACK',
                }
            case 'PACKED':
                return {
                    buttonText: '',
                }
            case 'OUT FOR DELIVERY':
                return {
                    buttonText: 'MARK AS DELIVERED',
                }
            case 'CANCELLED':
                return {
                    buttonText: '',
                }
            default:
                return {
                    buttonText: '',
                    modalContent: '',
                }
        }
    }

    const { buttonText, modalContent: content } =
        getButtonAndModalContent(status)

    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>

            <Timeline className="mb-5">
                {data.length === 0 ? (
                    <p>No activity data available.</p>
                ) : (
                    data.map((activity, i) => (
                        <Timeline.Item
                            key={activity.status + i}
                            media={
                                <div className="flex mt-1.5">
                                    <Badge
                                        innerClass={classNames(
                                            activity.timestamp
                                                ? 'bg-emerald-500'
                                                : 'bg-blue-500',
                                        )}
                                    />
                                </div>
                            }
                        >
                            <div className="font-bold text-md">
                                {activity.status}
                            </div>
                            <div>
                                {moment(activity.timestamp).format(
                                    'DD:MM:YYYY hh:mm',
                                )}
                            </div>
                        </Timeline.Item>
                    ))
                )}
            </Timeline>

            {buttonText && (
                <Button variant="solid" onClick={() => showModal(content)}>
                    {buttonText}
                </Button>
            )}

            {status === 'PENDING' ? (
                <Modal
                    title=""
                    okText="ACCEPT & PACK"
                    cancelText="REJECT ORDERS"
                    width={800}
                    height={800}
                    okButtonProps={{
                        className: 'font-bold',
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '15px',
                        },
                    }}
                    cancelButtonProps={{
                        className: 'font-bold',
                        style: {
                            backgroundColor: 'gray',
                            color: 'white',
                            borderRadius: '15px',
                        },
                    }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>{modalContent}</p>
                    <div className="flex flex-col">
                        <h1 className="text-[20px]">
                            Invoice Id:{' '}
                            <span className="font-normal">{invoice_id}</span>
                        </h1>
                        <h1 className="text-[16px]">
                            Total Amount:{' '}
                            <span className="font-normal">
                                Rs.{payment?.amount}
                            </span>
                        </h1>
                    </div>
                    {product && product.length > 0 && (
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">SKU</th>
                                    <th className="px-4 py-2">PRODUCT IMAGE</th>
                                    <th className="px-4 py-2">PRODUCT NAME</th>
                                    <th className="px-4 py-2">ORDERED QTY</th>
                                    <th className="px-4 py-2">
                                        FULFILLED QTY
                                    </th>{' '}
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((pdts) => (
                                    <tr key={pdts.id} className="border-t">
                                        {' '}
                                        <td className="px-4 py-2">
                                            {pdts.sku}
                                        </td>
                                        <td className="px-4 py-2">
                                            <img
                                                src={pdts.image}
                                                alt=""
                                                className="w-20 h-30 object-cover"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            {pdts.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {pdts.quantity}
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={
                                                    fulfilledQuantities[
                                                        pdts.id
                                                    ] || pdts.quantity
                                                }
                                                className="w-full px-2 py-1 border"
                                                onChange={(e) =>
                                                    handleSelectChange(
                                                        pdts.id,
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                {Array.from(
                                                    {
                                                        length:
                                                            parseInt(
                                                                pdts.quantity,
                                                                10,
                                                            ) + 1,
                                                    },
                                                    (_, i) => i,
                                                ).map((val) => (
                                                    <option
                                                        key={val}
                                                        className="py-3 px-2"
                                                        value={val.toString()}
                                                    >
                                                        {val}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {errorMessage && (
                        <div className="text-red-500 mb-4">{errorMessage}</div>
                    )}
                </Modal>
            ) : (
                <Modal
                    title=""
                    okText="PACKED"
                    cancelText="CANCEL"
                    width={800}
                    height={800}
                    okButtonProps={{
                        className: 'font-bold',
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '15px',
                        },
                    }}
                    cancelButtonProps={{
                        className: 'font-bold',
                        style: {
                            backgroundColor: 'gray',
                            color: 'white',
                            borderRadius: '15px',
                        },
                    }}
                    open={isModalOpen}
                    onOk={handlePack}
                    onCancel={handleClose}
                >
                    <h1>MARK AS PACKED</h1>
                </Modal>
            )}
        </Card>
    )
}

export default Activity
