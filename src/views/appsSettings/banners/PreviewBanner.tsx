import React from 'react';
import { API_RESPONSE } from './data';
import { AllComponentsLib } from "slikk-react-comps";
import { Button } from '@/components/ui';
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup';

function PreviewBanner({ setCurrentStep, completeBannerFormData, selectedPage, selectedSection }: any) {

    console.log(completeBannerFormData);

    const getFullBannerDataFromBannerFormArray = async () => {

        const response = await axioisInstance.get("page/sections?device_type=Web").then((res) => {
            return res.data.data
        }).catch((err) => {
            return [];
        });

        console.log(response);

        let FULL_BANNER_API = {
            position : 1,
            component_type : selectedSection?.component_type,
            header_config : selectedSection?.header_config,
            sub_header_config : selectedSection?.sub_header_config,
            footer_config : selectedSection?.footer_config,
            background_image : selectedSection?.background_image,
            section_heading : selectedSection?.section_heading,
            data_type : selectedSection?.data_type,
            data : []
        };

        let data : any[] = [];

        completeBannerFormData?.forEach((banner : any, index : number) => {
            data.push({
                pk : index,
                ...banner,
                quick_filter_tags : [],
                tags : []
            })
        });

        FULL_BANNER_API.data = data;

        console.log([...response, FULL_BANNER_API]);
        return [...response, FULL_BANNER_API];
    }

    return (
        <div className='gap-3 w-full'>
            <div className='mb-5 self-center w-full px-[10%]'>
                <Button size="lg" onClick={() => {setCurrentStep(3)}} variant="new">
                    Add/Edit More Banners
                </Button>
            </div>
            <div className='bg-black flex flex-col gap-y-5 md:gap-y-7 lg:gap-y-10 lg:px-[5%] absolute w-full z-40 overflow-y-scroll py-10'>
                <AllComponentsLib data={getFullBannerDataFromBannerFormArray()} size="lg" />
            </div>
        </div>
    )
}

export default PreviewBanner

// getFullBannerDataFromBannerFormArray()