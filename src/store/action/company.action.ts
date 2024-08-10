import axioisInstance from "@/utils/intercepter/globalInterceptorSetup";
import { SINGLE_COMPANY_DATA, companyRequest, companyRequestSuccess } from "../types/company.types"

export const getUserProfileAPI = () => async (dispatch : any) => {
    try{
        dispatch({
            type : companyRequest
        });

        const response = await axioisInstance.get("dashboard/user/profile");

        dispatch({
            type : "companyRequestSuccess",
            payload : {
                ...response?.data?.data
            }
        });

        if(response?.data?.data?.company?.length > 0){
            dispatch(setDefaultCompanyId(response?.data?.data?.company[0]));
        }

    } catch(err){
        dispatch({
            type : "companyRequestFailure"
        })
    }
}

export const setDefaultCompanyId = (company : SINGLE_COMPANY_DATA) => async (dispatch : any) => {
    dispatch({
        type : "defaultCompanyRequest",
        payload : {
            currCompany : company,
        }
    })
}