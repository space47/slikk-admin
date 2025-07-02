import { EventSearchOptions } from '../../eventCommons/eventCommonArray'

export const handleSelect = (value: any, setCurrentSelectedPage: any) => {
    const selected = EventSearchOptions.find((item) => item.value === value)
    if (selected) {
        setCurrentSelectedPage(selected)
    }
}
