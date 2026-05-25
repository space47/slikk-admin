import { Button } from '@/components/ui'
import { FiSearch } from 'react-icons/fi'

interface Props {
    text?: string
    apiCall?: any
}

const NotFoundData: React.FC<Props> = ({ text, apiCall }) => {
    const renderError = () => {
        if (!apiCall.isError) return null

        const error = apiCall.error

        const status = error?.status

        let message = 'Something went wrong. Please try again.'

        if (status === 403) {
            message = 'You do not have permission to view this data.'
        } else if (status === 400) {
            message = 'Invalid request. Please check filters.'
        } else if (status === 500) {
            message = 'Server error. Try again later.'
        } else if (!status) {
            message = 'Network error. Check your connection.'
        }

        return (
            <div className="flex flex-col items-center justify-center py-10 text-red-500">
                <p className="text-lg font-semibold">{message}</p>
                <Button className="mt-4" size="sm" onClick={() => apiCall.refetch()}>
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="xl:mt-10 flex justify-center">
            <div className="flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-2xl shadow-sm px-10 py-12 max-w-md w-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-5">
                    <FiSearch className="text-blue-600 text-3xl" />
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>

                {apiCall ? (
                    <>{renderError()}</>
                ) : (
                    <p className="text-gray-500 text-sm max-w-sm">
                        {text
                            ? text
                            : 'We could not find any data matching your current search or filters. Try adjusting the parameters and search again.'}
                    </p>
                )}
            </div>
        </div>
    )
}

export default NotFoundData
