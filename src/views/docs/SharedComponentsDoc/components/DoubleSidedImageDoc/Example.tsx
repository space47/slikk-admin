import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

const Example = () => {
    return (
        <div className="mb-10">
            <DoubleSidedImage
                src="/img/logo/logo-light-full.png"
                darkModeSrc="/img/logo/logo-light-full.png"
                alt="elstar"
                // className="flex"
                // style={{ width: '1px', height: '1px' }}
            />
        </div>
    )
}

export default Example
