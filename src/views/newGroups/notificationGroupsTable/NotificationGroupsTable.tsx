import EasyTable from '@/common/EasyTable'
import { Button } from '@/components/ui'
import { Input } from 'antd'
import React from 'react'

const NotificationGroupsTable = () => {
    // const columns = []

    return (
        <div>
            <div>User Cohorts</div>

            <div className="flex justify-between">
                <div>
                    <Input placeholder="Search by name" />
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="new">Create Cohort</Button>
                    <Button variant="solid">Quick Filter</Button>
                </div>
            </div>
            <div>{/* <EasyTable columns={columns} mainData={[]} /> */}</div>
        </div>
    )
}

export default NotificationGroupsTable
