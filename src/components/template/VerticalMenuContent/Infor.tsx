import Dropdown from '@/components/ui/Dropdown'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import type { SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'

interface users {
    id: number

    name: string

    registered_name: string
}

const Infor = () => {
    // const [value, setValue] = useState()
    // const fetch = async () => {
    //     try {
    //         const response = await axioisInstance.get(`dashboard/user/profile`) // login wale se krna he
    //         const val = response.data.data.company

    //         console.log(response.data.data.company)
    //         return val
    //     } catch (error) {
    //         console.log(`object`, error)
    //     }
    // }

    // useEffect(() => {
    //     fetch()
    // }, [])

    const dropdownItems = [
        { key: 'Company Name', name: 'val.name' },
        { key: 'b', name: 'I' },
        { key: 'c', name: 'Item C' },
        { key: 'd', name: 'Item D' },
    ]

    const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
        console.log('Dropdown Item Clicked', eventKey, e)
    }

    const onDropdownClick = (e: SyntheticEvent) => {
        console.log('Dropdown Clicked', e)
    }

    return (
        <div>
            <Dropdown title="Details" onClick={onDropdownClick}>
                {dropdownItems.map((item) => (
                    <Dropdown.Item
                        key={item.key}
                        eventKey={item.key}
                        onSelect={onDropdownItemClick}
                    >
                        {item.name}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </div>
    )
}

export default Infor
