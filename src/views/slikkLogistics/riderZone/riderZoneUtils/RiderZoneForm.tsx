/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import { Field, Form } from 'formik'
import React from 'react'
import RiderZoneMap from './RiderZoneMap'
import FormButton from '@/components/ui/Button/FormButton'
import { Point } from './riderZoneCommon'

interface Props {
    coOrdinates?: any[]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

const RiderZoneForm = ({ polygonPoints, setPolygonPoints, coOrdinates }: Props) => {
    return (
        <Form className="space-y-6">
            <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Name">
                    <Field type="text" placeholder="Enter Name" component={Input} name="name" />
                </FormItem>

                <FormItem label="Code">
                    <Field type="text" placeholder="Enter Code" component={Input} name="code" />
                </FormItem>

                <FormItem label="Is Active">
                    <Field type="checkbox" component={Switcher} name="is_active" />
                </FormItem>
            </FormContainer>
            <div>
                <h6>Set Zone</h6>

                <RiderZoneMap coOrdinates={coOrdinates || []} polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints} />
            </div>
            <div className="pt-4">
                <FormButton value="Submit" className="w-full md:w-auto" />
            </div>
        </Form>
    )
}

export default RiderZoneForm
