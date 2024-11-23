import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

const BadRequest = () => {
    return (
        <Container className="h-full">
            <div className="h-full flex flex-col items-center justify-center">
                {/* <DoubleSidedImage
                    src="/img/others/img-2.png"
                    darkModeSrc="/img/others/img-2-dark.png"
                    alt="Access Denied!"
                /> */}
                <div className="mt-6 text-center">
                    <h3 className="mb-2 text-xl text-red-600">You Have Passed Wrong values</h3>
                    <p className="text-base">Try changing your values for the required data</p>
                </div>
            </div>
        </Container>
    )
}

export default BadRequest
