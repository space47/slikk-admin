import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
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
    handleSchedule: any
    valueForSchedule: any
    scheduleModal: boolean

    values: any
}

const FourthStep = ({ valueForSchedule, scheduleModal, handleSchedule, values }: FourthStepProps) => {
    const initialValues = {}

    return (
        <div className="pace-y-6 shadow-lg rounded-lg px-14 py-9 xl:w-[500px] xl:h-[390px]">
            {USERNOTFARRAY.map((item, key) => (
                <FormItem key={key} label={item.label} className={item.classname}>
                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                </FormItem>
            ))}

            <div className="flex gap-3 ">
                <Field type="checkbox" name="users_all" component={Input} />
                <div className="font-bold">Send to all Users</div>
            </div>
            <br />
            <div className="flex ">
                <Checkbox className=" " onChange={() => handleSchedule(values)}></Checkbox>
                <div className="font-bold">Schedule Notification for Later</div>
            </div>

            {/* <Button onClick={handleSchedule}>Schedule Notification</Button> */}
            {/* {scheduleModal && <SchedularModal handleOk={handleOk} scheduleValues={valueForSchedule} />} */}
        </div>
    )
}

export default FourthStep
