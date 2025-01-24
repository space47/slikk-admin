/* eslint-disable @typescript-eslint/no-explicit-any */
export type JobPostingTypes = {
    id: number
    department: number
    job_id: string
    title: string
    description: string
    location: string
    job_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'OTHER'
    min_experience: number
    salary_range: string
    responsibilities: string
    qualifications: string
    how_to_apply: string
    extra_attributes: any
    is_active: boolean
    created_at: string
    updated_at: string
}

export const CareerFormArray = [
    { name: 'title', label: 'Job Title', type: 'text' },
    { name: 'location', label: 'Job Location', type: 'text' },
    { name: 'min_experience', label: 'Min Experience', type: 'number' },
    { name: 'qualifications', label: 'Qualification', type: 'text' },
]

export const SEARCHOPTIONS = [
    { label: 'Title', value: 'title' },
    { label: 'Location', value: 'location' },
]
