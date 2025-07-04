/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Card, Timeline } from '@/components/ui'
import classNames from 'classnames'
import moment from 'moment'
import React from 'react'

interface props {
    eventLogs: any
}

const OrdersRiderActivity = ({ eventLogs }: props) => {
    const events = eventLogs?.event_logs

    return (
        <Card>
            <h5 className="mb-4">Riders Activity</h5>
            <Timeline className="mb-5">
                {events?.map((activity: any, i: any) => (
                    <Timeline.Item
                        key={activity.status + i}
                        media={
                            <div className="flex mt-1.5">
                                <Badge innerClass={classNames(activity.timestamp ? 'bg-emerald-500' : 'bg-blue-500')} />
                            </div>
                        }
                    >
                        <div className="font-bold text-md">{activity?.status}</div>
                        <div>{moment(activity?.timestamp).format('DD:MM:YYYY hh:mm a')}</div>
                        <div className="font-bold text-md">{activity?.RIDER}</div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    )
}

export default OrdersRiderActivity
