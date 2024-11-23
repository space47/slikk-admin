import Container from '@/components/shared/Container'
import { FaExclamationTriangle } from 'react-icons/fa' // Import an error icon from react-icons

const InternalError = () => {
    return (
        <Container className="h-full">
            <div className="flex h-full flex-col items-center justify-center space-y-6">
                <FaExclamationTriangle className="text-red-500 text-6xl" aria-hidden="true" />
                <div className="text-center">
                    <h3 className="mb-2 text-2xl font-semibold text-red-600">Internal Server Error</h3>
                    <p className="text-base text-gray-600">Sorry, but we encountered an error. Please wait while we resolve it.</p>
                </div>
            </div>
        </Container>
    )
}

export default InternalError
