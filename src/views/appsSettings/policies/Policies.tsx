/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { RichTextEditor } from '@/components/shared'
import { CONFIGOPTIONS } from './policiesCommon'
import { Dropdown, Button } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const Policies = () => {
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(CONFIGOPTIONS[0])
    const [data, setData] = useState<any[]>([])
    const [richTextValue, setRichTextValue] = useState('')

    const fetchData = async () => {
        console.log('starting api')
        try {
            axioisInstance
                .get(`/page/config?page_name=${currentSelectedPage.value}`)
                .then((response) => {
                    const responsedata = response.data.data.value
                    setData(responsedata)
                    setRichTextValue(responsedata)
                })
                .catch((error) => {
                    console.log(error)
                    setRichTextValue('')
                    setData([])
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [currentSelectedPage])

    const handleSelect = (a: any) => {
        setCurrentSelectedPage({
            value: a,
            name: CONFIGOPTIONS.find((p) => p.value == a)?.label || '',
        })
    }
    const handlePolicySubmit = async () => {
        try {
            const body = {
                page_name: currentSelectedPage.value,
                value: richTextValue,
            }
            axioisInstance.post(`/page/config?page_name=${currentSelectedPage.value}`, body)
            notification.success({
                message: 'Successfully added',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to Upload',
            })
        }
    }

    console.log('Data', data)

    return (
        <div className="flex flex-col gap-10">
            <div className=" text-black text-lg font-semibold inline-flex w-auto">
                <Dropdown className="text-xl text-black" title={currentSelectedPage.value} onSelect={handleSelect}>
                    {CONFIGOPTIONS?.map((item, key) => {
                        return (
                            <DropdownItem key={key} eventKey={item.value}>
                                <span>{item.label}</span>
                            </DropdownItem>
                        )
                    })}
                </Dropdown>
            </div>
            <div className="w-[90%] mb-5">
                <RichTextEditor className="h-[400px]" value={richTextValue} onChange={(value: string) => setRichTextValue(value)} />
            </div>
            <div className="policy_save_button ">
                <Button variant="solid" color="indigo" size="sm" type="submit" onClick={handlePolicySubmit}>
                    Submit
                </Button>
            </div>
            <div className="flex flex-col gap-6 w-[80%] items-center flex-wrap justify-center mx-12">
                <span className="text-4xl font-bold flex justify-center">Preview</span>
                <div className="flex flex-col gap-4 justify-center" dangerouslySetInnerHTML={{ __html: richTextValue }} />
            </div>
        </div>
    )
}

export default Policies
