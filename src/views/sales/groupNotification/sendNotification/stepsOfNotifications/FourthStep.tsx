/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { sendNotificationType, USERNOTFARRAY } from '../sendNotify.common'

interface FourthStepProps {
    handleSchedule: (value: any) => void
    valueForSchedule: any
    scheduleModal: boolean
    values: sendNotificationType
}

const FourthStep = ({ scheduleModal, handleSchedule, values }: FourthStepProps) => {
    return (
        <div
            className={
                scheduleModal
                    ? 'pace-y-6 shadow-lg rounded-lg px-14 py-9 xl:w-[500px] xl:h-[390px] '
                    : 'pace-y-6 shadow-lg rounded-lg px-14 py-9 xl:w-2/3 xl:h-[390px] '
            }
        >
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
        </div>
    )
}

export default FourthStep
