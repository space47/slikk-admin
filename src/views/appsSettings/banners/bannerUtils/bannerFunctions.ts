import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

export const fetchForSectionHeading = async (
    currentSelectedPage: Record<string, string>,
    currentSelectedSubPage: Record<string, string>,
) => {
    try {
        let subPageData = ''
        if (currentSelectedSubPage) {
            subPageData = `&sub_page=${currentSelectedSubPage?.name}`
        }
        const response = await axioisInstance.get(`/banners?data_type=section_heading&page=${currentSelectedPage.value}${subPageData}`)
        const data = response.data.data
        return data
    } catch (error) {
        console.log(error)
    }
}
