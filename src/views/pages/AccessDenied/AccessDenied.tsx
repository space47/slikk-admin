import Container from '@/components/shared/Container'
import { FaLock } from 'react-icons/fa' // Import a lock icon from react-icons

const AccessDenied = () => {
    return (
        <Container className="h-full">
            <div className="flex h-full flex-col items-center justify-center space-y-6">
                <FaLock className="text-red-600 text-6xl" aria-hidden="true" />
                <div className="text-center">
                    <h3 className="mb-2 text-2xl font-semibold text-gray-800">Access Denied!</h3>
                    <p className="text-base text-gray-600">You don't have permission to view this page.</p>
                </div>
            </div>
        </Container>
    )
}

export default AccessDenied
