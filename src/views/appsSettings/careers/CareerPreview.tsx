/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import React from 'react'
import { BiBriefcase, BiMapPin } from 'react-icons/bi'
import { BsClock } from 'react-icons/bs'
import { FaDollarSign } from 'react-icons/fa'

interface props {
    jobDetails: any
}

const CareerPreview = ({ jobDetails }: props) => {
    console.log('jobDetails', jobDetails)
    return (
        <div className="min-h-screen bg-white text-black">
            <header className="py-6 px-4 md:px-6 lg:px-8 border-b border-gray-200">
                <h1 className="text-5xl font-bold tracking-tight text-center text-gray-900 capitalize">{jobDetails.title}</h1>
            </header>

            <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <section className="mb-8" aria-labelledby="about-role">
                    <h2 id="about-role" className="text-2xl font-semibold mb-4">
                        About the Role
                    </h2>
                    <div>
                        <div className="text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: jobDetails.description }} />
                    </div>
                </section>

                <section className="mb-8 bg-white p-6 rounded-lg shadow-sm" aria-labelledby="job-details">
                    <h2 id="job-details" className="text-2xl font-semibold mb-4">
                        Job Details
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <BiMapPin className="w-5 h-5 mr-2 text-gray-400" />
                            <span>
                                <strong>Location:</strong> {jobDetails.location}
                            </span>
                        </li>
                        <li className="flex items-center">
                            <BiBriefcase className="w-5 h-5 mr-2 text-gray-400" />
                            <span>
                                <strong>Job Type:</strong> {jobDetails.job_type}
                            </span>
                        </li>
                        <li className="flex items-center">
                            <BsClock className="w-5 h-5 mr-2 text-gray-400" />
                            <span>
                                <strong>Minimum Experience:</strong> {jobDetails.min_experience} years
                            </span>
                        </li>
                        {jobDetails.salary_range && (
                            <li className="flex items-center">
                                <FaDollarSign className="w-5 h-5 mr-2 text-gray-400" />
                                <span>
                                    <strong>Salary Range:</strong> {jobDetails.salary_range}
                                </span>
                            </li>
                        )}
                    </ul>
                </section>

                <section className="mb-8" aria-labelledby="responsibilities">
                    <h2 id="responsibilities" className="text-2xl font-semibold mb-4">
                        Responsibilities
                    </h2>
                    <div>
                        <div className="text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: jobDetails.responsibilities }} />
                    </div>
                </section>

                <section className="mb-8" aria-labelledby="qualifications">
                    <h2 id="qualifications" className="text-2xl font-semibold mb-4">
                        Qualifications
                    </h2>
                    <div className="text-gray-600 prose max-w-none">{jobDetails.qualifications}</div>
                </section>

                <section className="mb-8" aria-labelledby="how-to-apply">
                    <h2 id="how-to-apply" className="text-2xl font-semibold mb-4">
                        How to Apply
                    </h2>
                    <div>
                        <div className="text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: jobDetails.how_to_apply }} />
                    </div>
                </section>

                <Button type="button" variant="new" className="w-full py-3 text-lg font-semibold transition-colors">
                    Apply Now
                </Button>
            </main>
        </div>
    )
}

export default CareerPreview
