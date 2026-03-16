/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { VendorStateType } from '@/store/slices/vendorsSlice/vendors.slice'
import { Field, FieldProps } from 'formik'

interface Props {
    values: any
}

const SellerInternal = ({ values }: Props) => {
    const { configValues } = useAppSelector<VendorStateType>((state) => state.vendor)

    const internalData =
        values?.segment?.split(',')?.reduce((acc: Record<string, any>, item: string) => {
            acc[item] = configValues?.value?.category_team[item?.toUpperCase()] || []
            return acc
        }, {}) || {}

    const internalPOC = Object.entries(internalData).flatMap(([category, people]: any) =>
        people.map((person: any) => ({
            label: `${person.name} (${category})`,
            value: person,
        })),
    )

    return (
        <div>
            <h4>POC Internal Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>

            <div className="mt-10 space-y-6">
                <FormItem asterisk label="Select POC" className="col-span-1 w-full">
                    <Field name={'int_poc_details'}>
                        {({ field, form }: FieldProps) => {
                            const selectedOptions =
                                internalPOC?.filter((option: any) => field?.value?.some((val: any) => val.email === option.value.email)) ||
                                []

                            return (
                                <Select
                                    isMulti
                                    isClearable
                                    className="w-full"
                                    options={internalPOC}
                                    getOptionLabel={(option: any) => option.label}
                                    getOptionValue={(option: any) => option.value.email}
                                    value={selectedOptions}
                                    onChange={(newVals: any) => {
                                        const valuesOnly = newVals?.map((val: any) => val.value) || []

                                        form.setFieldValue('int_poc_details', valuesOnly)
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>

                {Object.entries(internalData).map(([category, people]: any) => {
                    const filteredPeople = people.filter((person: any) =>
                        values?.int_poc_details?.some((selected: any) => selected.email === person.email),
                    )

                    if (filteredPeople.length === 0) return null

                    return (
                        <div key={category} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-gray-100 border-b">
                                <h5 className="text-lg font-semibold text-gray-800">{category}</h5>
                            </div>

                            <div className="p-4">
                                <div className="divide-y">
                                    {filteredPeople.map((person: any, index: number) => (
                                        <div key={index} className="py-2 grid grid-cols-1 md:grid-cols-3 gap-1 text-sm">
                                            <div>
                                                <p className="text-blue-500 text-xs">Name</p>
                                                <p className="font-medium text-gray-800">{person.name}</p>
                                            </div>

                                            <div>
                                                <p className="text-blue-500 text-xs">Mobile</p>
                                                <p className="font-medium text-gray-800">{person.mobile}</p>
                                            </div>

                                            <div>
                                                <p className="text-blue-500 text-xs">Email</p>
                                                <p className="font-medium text-gray-800 break-all">{person.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SellerInternal
