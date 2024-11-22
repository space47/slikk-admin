import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { SchedulerARRAY, USERNOTFARRAY } from '../sendNotify.common'
import { DatePicker } from 'antd'
import moment from 'moment'
import Button from '@/components/ui/Button'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import SchedularModal from '../SchedularModule'

const REPEATARRAY = [
    { label: 'Day', value: 'day' },
    { label: 'Hour', value: 'hour' },
]

interface FourthStepProps {
    handleOk: any
    handleSchedule: any
    valueForSchedule: any
    scheduleModal: boolean
}

const FourthStep = ({ handleOk, valueForSchedule, scheduleModal }: FourthStepProps) => {
    const initialValues = {}
    console.log('ssss', valueForSchedule)
    return (
        <div>
            {USERNOTFARRAY.map((item, key) => (
                <FormItem key={key} label={item.label} className={item.classname}>
                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                </FormItem>
            ))}

            {/* <Button onClick={handleSchedule}>Schedule Notification</Button> */}
            {/* {scheduleModal && <SchedularModal handleOk={handleOk} scheduleValues={valueForSchedule} />} */}
        </div>
    )
}

export default FourthStep
