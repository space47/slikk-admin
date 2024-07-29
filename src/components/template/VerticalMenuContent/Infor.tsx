import Dropdown from '@/components/ui/Dropdown'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import type { SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Users {
    id: number
    name: string
    registered_name: string
}

const Infor = () => {
    const [compNames, setCompNames] = useState<Users[]>([])
    const [selectedComp, setSelectedComp] = useState<string>('')
    const [compId, setCompId] = useState<number>()

    useEffect(() => {
        const fetchCompNames = async () => {
            try {
                const response = await axiosInstance.get(
                    'dashboard/user/profile',
                )
                const companies = response.data?.data?.company
                const compNameArray = companies.map((company: any) => ({
                    id: company.id,
                    registered_name: company.name,
                }))

                setCompNames(compNameArray)
                if (compNameArray.length > 0) {
                    setSelectedComp(compNameArray[0].registered_name)
                    setCompId(compNameArray[0].id)
                }
            } catch (error) {
                console.error('Error fetching comp names:', error)
            }
        }

        fetchCompNames()
    }, [])

    const onDropdownItemClick = (eventKey: string) => {
        const selectedCompany = compNames.find(
            (company) => company.id.toString() === eventKey,
        )
        console.log('evvvvvvvvvvvvvvvvvvvent', eventKey)
        if (selectedCompany) {
            setSelectedComp(selectedCompany.registered_name)
            setCompId(selectedCompany.id)
        }
        console.log('cooooooomp', compId)
    }

    const onDropdownClick = (e: SyntheticEvent) => {
        console.log('Dropdown Clicked', e)
    }

    const navigate = useNavigate()

    const handleOption = () => {
        //  navigate('')
        console.log('object')
    }

    return (
        <div>
            <Dropdown
                title={`${selectedComp} ${compId}`}
                onClick={onDropdownClick}
            >
                {compNames.map((item) => (
                    <Dropdown.Item
                        key={item.id}
                        eventKey={item.id.toString()}
                        onSelect={onDropdownItemClick}
                    >
                        <div onClick={handleOption}>{item.registered_name}</div>
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </div>
    )
}

export default Infor
