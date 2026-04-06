/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input } from '@/components/ui'
import { Formik, FieldArray, Field, FormikProps, Form } from 'formik'
import React, { useState } from 'react'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi'

// ─── Types ────────────────────────────────────────────────────────────────────

type ValueType = 'string' | 'number' | 'boolean' | 'object' | 'array'

interface DynamicNode {
    key: string
    value: any
    valueType: ValueType
    children?: DynamicNode[]
    arrayItemType?: ValueType // For arrays, what type of items they contain
}

interface FormValues {
    name: string
    description: string
    commercial_details: {
        payout_model: string
        base_payout: number
        currency: string
        incentives: DynamicNode[]
        penalties: DynamicNode[]
    }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYOUT_MODELS = [
    { value: 'day-wise', label: 'Day Wise' },
    { value: 'order-wise', label: 'Order Wise' },
    { value: 'hour-wise', label: 'Hour Wise' },
]

const CURRENCIES = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
]

const VALUE_TYPES: { value: ValueType; label: string }[] = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'object', label: 'Object' },
    { value: 'array', label: 'Array' },
]

const ARRAY_ITEM_TYPES: { value: ValueType; label: string }[] = [
    { value: 'string', label: 'Array of Strings' },
    { value: 'number', label: 'Array of Numbers' },
    { value: 'boolean', label: 'Array of Booleans' },
    { value: 'object', label: 'Array of Objects' },
]

const emptyNode = (): DynamicNode => ({
    key: '',
    value: '',
    valueType: 'string',
    children: [],
    arrayItemType: 'object',
})

const initialValues: FormValues = {
    name: '',
    description: '',
    commercial_details: {
        payout_model: 'day-wise',
        base_payout: 0,
        currency: 'INR',
        incentives: [],
        penalties: [],
    },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildValueFromNode(node: DynamicNode): any {
    if (node.valueType === 'object') {
        const obj: Record<string, any> = {}
        node.children?.forEach((child) => {
            if (child.key) {
                obj[child.key] = buildValueFromNode(child)
            }
        })
        return obj
    }

    if (node.valueType === 'array') {
        if (node.arrayItemType === 'object') {
            // Array of objects
            return node.children?.map((child) => buildValueFromNode(child)) || []
        } else {
            // Array of primitives
            return (
                node.children?.map((child) => {
                    if (child.valueType === 'number') return Number(child.value)
                    if (child.valueType === 'boolean') return child.value === 'true' || child.value === true
                    return String(child.value || '')
                }) || []
            )
        }
    }

    if (node.valueType === 'number') {
        return isNaN(Number(node.value)) ? 0 : Number(node.value)
    }

    if (node.valueType === 'boolean') {
        return node.value === 'true' || node.value === true
    }

    return String(node.value || '')
}

function buildOutput(values: FormValues) {
    const buildDynamicStructure = (nodes: DynamicNode[]): any => {
        if (!nodes || nodes.length === 0) return {}

        const result: Record<string, any> = {}

        nodes.forEach((node) => {
            if (node.key) {
                result[node.key] = buildValueFromNode(node)
            }
        })

        return result
    }

    return {
        name: values.name,
        description: values.description,
        commercial_details: {
            payout_model: values.commercial_details.payout_model,
            base_payout: values.commercial_details.base_payout,
            currency: values.commercial_details.currency,
            incentives: buildDynamicStructure(values.commercial_details.incentives),
            penalties: buildDynamicStructure(values.commercial_details.penalties),
        },
    }
}

// ─── Type Selection Modal ─────────────────────────────────────────────────────

interface TypeSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (type: ValueType) => void
    parentPath: string
    isArrayItem?: boolean
}

const TypeSelectionModal: React.FC<TypeSelectionModalProps> = ({ isOpen, onClose, onSelect, isArrayItem = false }) => {
    if (!isOpen) return null

    const types = isArrayItem ? ARRAY_ITEM_TYPES : VALUE_TYPES

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{isArrayItem ? 'Select Array Item Type' : 'Select Value Type'}</h3>
                <div className="space-y-2">
                    {types.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => {
                                onSelect(type.value)
                                onClose()
                            }}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                                {type.value === 'object' && 'Key-value pairs'}
                                {type.value === 'array' && 'Nested arrays'}
                                {type.value === 'string' && 'Text values'}
                                {type.value === 'number' && 'Numeric values'}
                                {type.value === 'boolean' && 'True/False values'}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Dynamic Node Component ───────────────────────────────────────────────────

interface DynamicNodeProps {
    baseName: string
    node: DynamicNode
    onRemove?: () => void
    setFieldValue: (name: string, value: unknown) => void
    depth?: number
    parentPath?: string
    isArrayItem?: boolean
}

const DynamicNodeComponent: React.FC<DynamicNodeProps> = ({
    baseName,
    node,
    onRemove,
    setFieldValue,
    depth = 0,
    parentPath = '',
    isArrayItem = false,
}) => {
    const [expanded, setExpanded] = useState(true)
    const [showTypeModal, setShowTypeModal] = useState(false)
    const [showArrayItemTypeModal, setShowArrayItemTypeModal] = useState(false)
    const marginLeft = depth * 20

    const currentPath = parentPath ? `${parentPath}.${node.key || '?'}` : node.key || '?'

    const handleTypeChange = (newType: ValueType) => {
        setFieldValue(`${baseName}.valueType`, newType)

        if (newType === 'object') {
            setFieldValue(`${baseName}.children`, [])
            setFieldValue(`${baseName}.value`, '')
        } else if (newType === 'array') {
            setFieldValue(`${baseName}.children`, [])
            setFieldValue(`${baseName}.value`, '')
            // Show modal to select array item type
            setShowArrayItemTypeModal(true)
        } else {
            setFieldValue(`${baseName}.children`, [])
            setFieldValue(`${baseName}.value`, '')
        }
    }

    const handleArrayItemTypeChange = (itemType: ValueType) => {
        setFieldValue(`${baseName}.arrayItemType`, itemType)
        setFieldValue(`${baseName}.children`, [])
    }

    const renderValueInput = () => {
        if (node.valueType === 'object') {
            return (
                <div className="ml-6 mt-3 border-l-2 border-indigo-200 pl-4">
                    <FieldArray name={`${baseName}.children`}>
                        {({ push, remove }) => (
                            <div className="space-y-3">
                                {(node.children || []).map((child, idx) => (
                                    <DynamicNodeComponent
                                        key={idx}
                                        baseName={`${baseName}.children[${idx}]`}
                                        node={child}
                                        onRemove={() => remove(idx)}
                                        setFieldValue={setFieldValue}
                                        depth={depth + 1}
                                        parentPath={currentPath}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTypeModal(true)
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
                                >
                                    <HiOutlinePlus className="w-3.5 h-3.5" /> Add Property
                                </button>
                                <TypeSelectionModal
                                    isOpen={showTypeModal}
                                    onClose={() => setShowTypeModal(false)}
                                    onSelect={(type) => {
                                        const newNode = emptyNode()
                                        newNode.valueType = type
                                        if (type === 'object' || type === 'array') {
                                            newNode.children = []
                                        }
                                        push(newNode)
                                    }}
                                    parentPath={`${currentPath}.new_property`}
                                />
                            </div>
                        )}
                    </FieldArray>
                </div>
            )
        }

        if (node.valueType === 'array') {
            const isArrayOfObjects = node.arrayItemType === 'object'
            const arrayItemType = node.arrayItemType || 'object'

            return (
                <div className="ml-6 mt-3 border-l-2 border-indigo-200 pl-4">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Array of:</span>
                        <button
                            type="button"
                            onClick={() => setShowArrayItemTypeModal(true)}
                            className="text-xs px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {ARRAY_ITEM_TYPES.find((t) => t.value === arrayItemType)?.label || 'Objects'}
                        </button>
                    </div>

                    <FieldArray name={`${baseName}.children`}>
                        {({ push, remove }) => (
                            <div className="space-y-3">
                                {(node.children || []).map((child, idx) => (
                                    <div key={idx} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-mono text-gray-500">Item {idx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => remove(idx)}
                                                className="p-1 text-red-400 hover:text-red-600 rounded"
                                            >
                                                <HiOutlineTrash className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {isArrayOfObjects ? (
                                            <DynamicNodeComponent
                                                baseName={`${baseName}.children[${idx}]`}
                                                node={child}
                                                setFieldValue={setFieldValue}
                                                depth={depth + 1}
                                                parentPath={`${currentPath}[${idx}]`}
                                                isArrayItem={true}
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type={arrayItemType === 'number' ? 'number' : 'text'}
                                                    placeholder={`Enter ${arrayItemType} value`}
                                                    value={child.value}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            `${baseName}.children[${idx}].value`,
                                                            arrayItemType === 'number' ? Number(e.target.value) : e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                                />
                                                {arrayItemType === 'boolean' && (
                                                    <select
                                                        value={String(child.value)}
                                                        onChange={(e) =>
                                                            setFieldValue(`${baseName}.children[${idx}].value`, e.target.value === 'true')
                                                        }
                                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                                    >
                                                        <option value="false">false</option>
                                                        <option value="true">true</option>
                                                    </select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isArrayOfObjects) {
                                            const newNode = emptyNode()
                                            newNode.valueType = 'object'
                                            newNode.children = []
                                            push(newNode)
                                        } else {
                                            push({ key: '', value: '', valueType: arrayItemType, children: [] })
                                        }
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
                                >
                                    <HiOutlinePlus className="w-3.5 h-3.5" /> Add Array Item
                                </button>
                                <TypeSelectionModal
                                    isOpen={showArrayItemTypeModal}
                                    onClose={() => setShowArrayItemTypeModal(false)}
                                    onSelect={handleArrayItemTypeChange}
                                    parentPath={`${currentPath}[item]`}
                                    isArrayItem={true}
                                />
                            </div>
                        )}
                    </FieldArray>
                </div>
            )
        }

        // Primitive types
        if (node.valueType === 'boolean') {
            return (
                <select
                    value={String(node.value)}
                    onChange={(e) => setFieldValue(`${baseName}.value`, e.target.value === 'true')}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                    <option value="false">false</option>
                    <option value="true">true</option>
                </select>
            )
        }

        return (
            <input
                type={node.valueType === 'number' ? 'number' : 'text'}
                placeholder={`Enter ${node.valueType} value`}
                value={node.value}
                onChange={(e) => setFieldValue(`${baseName}.value`, node.valueType === 'number' ? Number(e.target.value) : e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
        )
    }

    return (
        <div className="space-y-2" style={{ marginLeft: marginLeft > 0 ? marginLeft : undefined }}>
            <div className="flex items-start gap-2">
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                    {(node.valueType === 'object' || node.valueType === 'array') && (
                        <button type="button" onClick={() => setExpanded(!expanded)} className="p-1 text-gray-400 hover:text-gray-600 mt-1">
                            {expanded ? <HiOutlineChevronUp className="w-3.5 h-3.5" /> : <HiOutlineChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    )}

                    {!isArrayItem && (
                        <input
                            type="text"
                            placeholder={depth === 0 ? 'key_name' : 'property_name'}
                            value={node.key}
                            onChange={(e) => setFieldValue(`${baseName}.key`, e.target.value)}
                            className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
                        />
                    )}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowTypeModal(true)}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            {VALUE_TYPES.find((t) => t.value === node.valueType)?.label || 'Select Type'}
                        </button>
                        <TypeSelectionModal
                            isOpen={showTypeModal}
                            onClose={() => setShowTypeModal(false)}
                            onSelect={handleTypeChange}
                            parentPath={currentPath}
                        />
                    </div>

                    {node.valueType !== 'object' && node.valueType !== 'array' && renderValueInput()}

                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {(node.valueType === 'object' || node.valueType === 'array') && expanded && renderValueInput()}
        </div>
    )
}

// ─── Dynamic Section Component ─────────────────────────────────────────────────

interface DynamicSectionProps {
    baseName: string
    title: string
    color: 'indigo' | 'rose'
    nodes: DynamicNode[]
    setFieldValue: (name: string, value: unknown) => void
}

const DynamicSection: React.FC<DynamicSectionProps> = ({ baseName, title, color, nodes, setFieldValue }) => {
    const [showTypeModal, setShowTypeModal] = useState(false)

    const getBorderColor = () => {
        return color === 'indigo' ? 'border-indigo-300' : 'border-rose-300'
    }

    const getButtonColor = () => {
        return color === 'indigo'
            ? 'border-indigo-200 text-indigo-500 hover:border-indigo-400 hover:text-indigo-700'
            : 'border-rose-200 text-rose-500 hover:border-rose-400 hover:text-rose-700'
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
                <p className="text-xs text-gray-400">Fully dynamic structure - add any nested objects, arrays, or primitives</p>
            </div>

            <FieldArray name={baseName}>
                {({ push, remove }) => (
                    <div className="space-y-4">
                        {nodes.map((node, idx) => (
                            <div key={idx} className={`border-l-4 ${getBorderColor()} bg-gray-50 rounded-lg p-4`}>
                                <DynamicNodeComponent
                                    baseName={`${baseName}[${idx}]`}
                                    node={node}
                                    onRemove={() => remove(idx)}
                                    setFieldValue={setFieldValue}
                                    depth={0}
                                    parentPath={`${title.toLowerCase()}.${node.key || `item_${idx}`}`}
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => setShowTypeModal(true)}
                            className={`w-full flex items-center justify-center gap-2 border-2 border-dashed ${getButtonColor()} rounded-2xl py-3 text-sm font-medium transition-colors`}
                        >
                            <HiOutlinePlus className="w-4 h-4" /> Add {title.slice(0, -1)} Section
                        </button>

                        <TypeSelectionModal
                            isOpen={showTypeModal}
                            onClose={() => setShowTypeModal(false)}
                            onSelect={(type) => {
                                const newNode = emptyNode()
                                newNode.valueType = type
                                if (type === 'object' || type === 'array') {
                                    newNode.children = []
                                }
                                if (type === 'array') {
                                    newNode.arrayItemType = 'object'
                                }
                                push(newNode)
                            }}
                            parentPath={`${title.toLowerCase()}.new_section`}
                        />
                    </div>
                )}
            </FieldArray>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const RiderPayoutAdd = () => {
    const [preview, setPreview] = useState<string | null>(null)

    const handleSubmit = (values: FormValues) => {
        const output = buildOutput(values)
        console.log('Submitting:', output)
        setPreview(JSON.stringify(output, null, 2))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="">
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Configuration</p>
                    <h1 className="text-2xl font-bold text-gray-900">Add Rider Payout Model</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Build completely dynamic payout structures - add any nested objects, arrays, or primitive values
                    </p>
                </div>

                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }: FormikProps<FormValues>) => (
                        <Form className="">
                            {/* Basic Info Section */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Basic Information</p>
                                <FormItem asterisk label="Name">
                                    <Field
                                        type="text"
                                        name="name"
                                        component={Input}
                                        placeholder="e.g. Payout Model April 2026"
                                        className="w-full"
                                    />
                                </FormItem>
                                <FormItem label="Description">
                                    <Field
                                        type="text"
                                        name="description"
                                        component={Input}
                                        placeholder="Optional description"
                                        className="w-full"
                                    />
                                </FormItem>
                            </div>

                            {/* Commercial Details */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Commercial Details</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <FormItem asterisk label="Payout Model">
                                        <select
                                            value={values.commercial_details.payout_model}
                                            onChange={(e) => setFieldValue('commercial_details.payout_model', e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                        >
                                            {PAYOUT_MODELS.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>
                                    </FormItem>
                                    <FormItem asterisk label="Base Payout">
                                        <input
                                            type="number"
                                            value={values.commercial_details.base_payout}
                                            onChange={(e) => setFieldValue('commercial_details.base_payout', Number(e.target.value))}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        />
                                    </FormItem>
                                    <FormItem asterisk label="Currency">
                                        <select
                                            value={values.commercial_details.currency}
                                            onChange={(e) => setFieldValue('commercial_details.currency', e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                        >
                                            {CURRENCIES.map((c) => (
                                                <option key={c.value} value={c.value}>
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                    </FormItem>
                                </div>
                            </div>

                            {/* Dynamic Sections */}
                            <DynamicSection
                                baseName="commercial_details.incentives"
                                title="Incentives"
                                color="indigo"
                                nodes={values.commercial_details.incentives}
                                setFieldValue={setFieldValue}
                            />

                            <DynamicSection
                                baseName="commercial_details.penalties"
                                title="Penalties"
                                color="rose"
                                nodes={values.commercial_details.penalties}
                                setFieldValue={setFieldValue}
                            />

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pb-6">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                                >
                                    Save Payout Model
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* JSON Preview */}
                {preview && (
                    <div className="mt-4 mb-10 bg-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Payload Preview</p>
                            <button
                                type="button"
                                onClick={() => setPreview(null)}
                                className="text-xs text-gray-500 hover:text-white transition"
                            >
                                Close
                            </button>
                        </div>
                        <pre className="text-xs text-green-400 overflow-auto max-h-[420px]">{preview}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RiderPayoutAdd
