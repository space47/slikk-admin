import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

interface props {
    idStoreForDelete: number | string | undefined
    setDeleteModal: (x: boolean) => void
    name: string
}

export const useDeleteFromCatalog = ({ idStoreForDelete, name, setDeleteModal }: props) => {
    const navigate = useNavigate()
    const deleteFromCatalog = async () => {
        try {
            const body = {
                id: idStoreForDelete,
            }
            const response = await axioisInstance.delete(name, {
                data: body,
            })
            setDeleteModal(false)
            navigate(0)
            return notification.success({
                message: response?.data?.message || 'Successfully Deleted',
            })
        } catch (error) {
            console.log(error)
            return notification.error({
                message: 'Failed to delete',
                description: 'Please try again later',
            })
        }
    }

    return { deleteFromCatalog }
}
