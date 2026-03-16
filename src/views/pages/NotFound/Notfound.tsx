import { FiSearch } from 'react-icons/fi'

interface Props {
    text?: string
}

const NotFoundData: React.FC<Props> = ({ text }) => {
    return (
        <div className="xl:mt-10 flex justify-center">
            <div className="flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-2xl shadow-sm px-10 py-12 max-w-md w-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-5">
                    <FiSearch className="text-blue-600 text-3xl" />
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>

                <p className="text-gray-500 text-sm max-w-sm">
                    {text
                        ? text
                        : 'We could not find any data matching your current search or filters. Try adjusting the parameters and search again.'}
                </p>
            </div>
        </div>
    )
}

export default NotFoundData
