/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ApplicantEditModal from './ApplicantEditModal'
import CareerColumns, { STATUS_OPTIONS } from '../careerUtils/CareerColumns'

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

    const columns = CareerColumns({ applicantStatus, handleApplicantStatus })

    const Job_Array = [
        { label: '📍 Location:', value: jobData?.location },
        { label: '💼 Job Type:', value: jobData?.job_type.replace('_', ' ') },
        { label: '🎯 Experience:', value: jobData?.min_experience },
        { label: '💰 Salary Range:', value: jobData?.salary_range },
    ]
    const Job_Array2 = [
        { label: '📌 Responsibilities', value: jobData?.responsibilities },
        { label: '🎓 Qualifications', value: jobData?.qualifications },
        { label: '📩 How to Apply', value: jobData?.how_to_apply },
    ]

    return (
        <div>
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-8 border border-gray-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{jobData?.title}</h2>
                <p className="text-gray-600 mb-6">{jobData?.description}</p>
                {Job_Array?.map((item, key) => (
                    <div key={key} className="grid grid-cols-2 gap-6 text-base">
                        <div className="flex items-center gap-2">
                            <p className="text-gray-500 font-semibold">{item?.label}</p>
                            <p className="text-gray-800">{item?.value}</p>
                        </div>
                    </div>
                ))}
                {Job_Array2?.map((item, key) => (
                    <div key={key} className="grid grid-cols-2 gap-3">
                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-900  pb-2">{item?.label}</h3>
                            <p className="text-gray-700 mt-2">{item?.value}</p>
                        </div>
                    </div>
                ))}

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
