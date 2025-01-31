/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ApplicantEditModal from './ApplicantEditModal'

export const STATUS_OPTIONS = [
    { label: 'SUBMITTED', value: 'SUBMITTED' },
    { label: 'REVIEWED', value: 'REVIEWED' },
    { label: 'INTERVIEWING', value: 'INTERVIEWING' },
    { label: 'OFFERED', value: 'OFFERED' },
    { label: 'REJECTED', value: 'REJECTED' },
]

const ApplicantDetails = () => {
    const { job_id } = useParams()
    const [jobData, setJobData] = useState<any>()
    const [applicantsDetails, setApplicantDetails] = useState<any[]>([])
    const [applicantStatus, setApplicantStatus] = useState<{
        [key: string]: { value: string; label: string }
    }>({})
    const [changeStatusModal, setChangeStatusModal] = useState(false)
    const [currentStatus, setCurrentStatus] = useState('')
    const [currentID, setCurrentID] = useState<number>()

    const fetchJobData = async () => {
        try {
            const response = await axioisInstance.get(`/jobs?job_id=${job_id}`)
            const data = response?.data?.data
            setJobData(data)
            setApplicantDetails(data?.applications)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchJobData()
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }: any) => <div>{row.original.name}</div>,
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: ({ row }: any) => <div>{row.original.mobile}</div>,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: ({ row }: any) => <div>{row.original.email}</div>,
            },
            {
                header: 'Current Location',
                accessorKey: 'current_location',
                cell: ({ row }: any) => <div>{row.original.current_location}</div>,
            },
            {
                header: 'Resume',
                accessorKey: 'resume',
                cell: ({ row }: any) =>
                    row.original.resume ? (
                        <a href={row.original.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            View Resume
                        </a>
                    ) : (
                        'N/A'
                    ),
            },
            {
                header: 'Notice Period',
                accessorKey: 'notice_period',
                cell: ({ row }: any) => <div>{row.original.notice_period ?? 'N/A'}</div>,
            },
            {
                header: 'Cover Letter',
                accessorKey: 'cover_letter',
                cell: ({ row }: any) => <div>{row.original.cover_letter}</div>,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }: any) => {
                    const Rowid = row?.original.id
                    const selectedStatus = applicantStatus[Rowid]?.label || row.original?.status || 'SELECT'
                    return (
                        <Dropdown
                            className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            title={selectedStatus}
                            onSelect={(value) => handleApplicantStatus(value, Rowid)}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {STATUS_OPTIONS.map((item, key) => (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                    >
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    )
                },
            },
            {
                header: 'Applied At',
                accessorKey: 'applied_at',
                cell: ({ row }: any) => <div>{moment(row.original.applied_at).format('DD-MM-YYYY HH:mm A')}</div>,
            },
            {
                header: 'Updated At',
                accessorKey: 'updated_at',
                cell: ({ row }: any) => <div>{moment(row.original.updated_at).format('DD-MM-YYYY HH:mm A')}</div>,
            },
            {
                header: 'LinkedIn Profile',
                accessorKey: 'linkedin_profile',
                cell: ({ row }: any) =>
                    row.original.linkedin_profile ? (
                        <a
                            href={row.original.linkedin_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            LinkedIn
                        </a>
                    ) : (
                        'N/A'
                    ),
            },
        ],
        [applicantStatus],
    )

    const handleApplicantStatus = (selectedValue: any, row: any) => {
        const selectedLabel = STATUS_OPTIONS.find((item) => item.value === selectedValue)?.label || ''
        setCurrentStatus(selectedValue)
        setCurrentID(row)
        setApplicantStatus((prev) => ({
            ...prev,
            [row]: { value: selectedValue, label: selectedLabel },
        }))
        setChangeStatusModal(true)
    }

    return (
        <div>
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-8 border border-gray-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{jobData?.title}</h2>
                <p className="text-gray-600 mb-6">{jobData?.description}</p>

                <div className="grid grid-cols-2 gap-6 text-base">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-semibold">📍 Location:</p>
                        <p className="text-gray-800">{jobData?.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-semibold">💼 Job Type:</p>
                        <p className="text-gray-800 capitalize">{jobData?.job_type.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-semibold">🎯 Experience:</p>
                        <p className="text-gray-800">{jobData?.min_experience} years</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-semibold">💰 Salary Range:</p>
                        <p className="text-gray-800">{jobData?.salary_range || 'Not specified'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-900  pb-2">📌 Responsibilities</h3>
                        <p className="text-gray-700 mt-2">{jobData?.responsibilities}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-900  pb-2">🎓 Qualifications</h3>
                        <p className="text-gray-700 mt-2">{jobData?.qualifications}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-900  pb-2">📩 How to Apply</h3>
                        <p className="text-gray-700 mt-2">{jobData?.how_to_apply}</p>
                    </div>
                </div>

                {jobData?.contact_email && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">📧 Contact Email</h3>
                        <p className="text-blue-600 font-semibold underline mt-2">{jobData?.contact_email}</p>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <div className="text-2xl font-semibold text-gray-900 mb-2">Job Applicants:</div>
                <EasyTable noPage mainData={applicantsDetails} columns={columns} />
                {changeStatusModal && (
                    <ApplicantEditModal
                        setIsOpen={setChangeStatusModal}
                        dialogIsOpen={changeStatusModal}
                        currentStatus={currentStatus}
                        currentId={currentID}
                    />
                )}
            </div>
        </div>
    )
}

export default ApplicantDetails
