import { MdSearchOff } from 'react-icons/md'

const NotFoundData = () => {
    return (
        <div className="xl:mt-10">
            <div className="flex h-full flex-col items-center justify-center space-y-6">
                <MdSearchOff className="text-red-600 text-6xl" aria-hidden="true" />
                <div className="text-center">
                    <h3 className="mb-2 text-2xl font-semibold text-gray-800">Not Found!</h3>
                    <p className="text-base text-gray-600">No data found for the following parameters</p>
                </div>
            </div>
        </div>
    )
}

export default NotFoundData
