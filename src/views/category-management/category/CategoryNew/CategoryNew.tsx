import CategoryForm, { FormModel, SetSubmitting } from '@/views/category-management/category/CategoryForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateCategory } from '@/services/SalesService'

const CategoryNew = () => {
    const navigate = useNavigate()

    const addProduct = async (data: FormModel) => {
        const response = await apiCreateCategory<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (values: FormModel, setSubmitting: SetSubmitting) => {
        setSubmitting(true)
        const success = await addProduct(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification title={'Successfuly added'} type="success" duration={2500}>
                    Division successfuly added
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/app/category/category')
        }
    }

    const handleDiscard = () => {
        navigate('/app/category/category')
    }

    return (
        <>
            <CategoryForm type="new" onFormSubmit={handleFormSubmit} onDiscard={handleDiscard} />
        </>
    )
}

export default CategoryNew
