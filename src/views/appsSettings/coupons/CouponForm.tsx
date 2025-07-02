/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'

interface CouponProps {
    CouponsType?: any
    values?: any
    ACTIONARRAY?: {
        name: string
        value: string
    }[]
    userAction?: any
    setUserAction?: any
    setFieldValue?: any
    resetForm?: any
    isEdit?: any
}

const CouponForm = ({ ACTIONARRAY, resetForm }: CouponProps) => {
    return (
        <Form className="w-3/4">
            <FormContainer>
                <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md">
                    <FormItem label="Users" className="flex flex-col gap-2">
                        <Field
                            type="text"
                            name="user"
                            placeholder="Enter User"
                            component={Input}
                            min="0"
                            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                    </FormItem>

                    <FormItem label="Action" className="flex flex-col gap-2">
                        <Field name="user_add_action">
                            {({ form, field }: FieldProps) => {
                                const selectedCompany = ACTIONARRAY?.find((option) => option.value === field?.value)

                                return (
                                    <div className="w-full">
                                        <Select
                                            className="w-full md:w-3/4 rounded-xl border border-gray-300 text-sm shadow-sm focus:ring-blue-500"
                                            options={ACTIONARRAY}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.value}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue('user_add_action', newVal?.value)
                                            }}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    borderRadius: '0.75rem',
                                                }),
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>
                    </FormItem>
                </FormContainer>

                <FormContainer className="flex justify-end mt-5">
                    <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                        Reset
                    </Button>
                    <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                        Submit
                    </Button>
                </FormContainer>
            </FormContainer>
        </Form>
    )
}

export default CouponForm
