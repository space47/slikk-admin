import { BANNER_UPLOAD_DATA } from '@/common/banner';
import { Button, Upload } from '@/components/ui';
import FontAwesome from '@/views/ui-components/common/Icons/FontAwesome';
import React, { useEffect, useState } from 'react'
import { FaCross, FaWindowClose, FaXRay } from 'react-icons/fa';

function AddBannerStep3({ selectedPage, selectedSectionData }: any) {

    const [bannerForm, setBannerFormData] = useState<BANNER_UPLOAD_DATA[]>([{}]);

    useEffect(() => {
        console.log(bannerForm);
    }, [bannerForm]);

    return (
        <div className='flex flex-col gap-y-3 w-full'>
            <div className='flex flex-col gap-y-3 w-full'>
                {bannerForm.map((_, key) => {
                    return <div key={key} className=' w-full border my-4 shadow-md relative min-h-[100px]'>
                        <SingleBannerFormComp bannerForm={bannerForm} setBannerForm={setBannerFormData} index={key} />

                        <div className='absolute top-5 right-5'>
                            <FaWindowClose color='red' onClick={() => {
                                setBannerFormData(bannerForm.filter((_, ind) => ind != key))
                            }} />
                        </div>
                    </div>
                })}
            </div>

            <div className='w-fit self-center'>
                <Button variant="new" size="sm" onClick={() => setBannerFormData([...bannerForm, {}])}>
                    +Add Banner Tile
                </Button>
            </div>
        </div>
    )
}

export default AddBannerStep3;


const SingleBannerFormComp = ({ bannerForm, setBannerForm, index }: any) => {

    const handleSetDataInForm = (key : string, value : any) => {
        const tempBannerForm = bannerForm;

        if(key == "image_web_file"){
            tempBannerForm[index] = {...bannerForm[index], [key] : value, 'image_web' : URL.createObjectURL(value)};
        } else if(key == "image_mobile_file"){
            tempBannerForm[index] = {...bannerForm[index], [key] : value, 'image_mobile' : URL.createObjectURL(value)};
        } else{
            tempBannerForm[index] = {...bannerForm[index], [key] : value};
        }
        console.log(tempBannerForm);
        setBannerForm(tempBannerForm);
    }

    return <div className='flex flex-row flex-wrap gap-x-5 gap-y-2 p-4'>

        <div className='flex flex-col gap-y-2 items-center justify-center'>
            <span>Select Banner Web Image</span>
            <Upload uploadLimit={1} onChange={(file, _) => handleSetDataInForm('image_web_file', file[0])} />
        </div>
        <div className='flex flex-col gap-y-2 items-center justify-center'>
            <span>Select Banner Mobile Image</span>
            <Upload uploadLimit={1} onChange={(file, _) => handleSetDataInForm('image_mobile_file', file[0])} />
        </div>
    </div>
} 