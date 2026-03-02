/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Card, Timeline } from '@/components/ui'
import classNames from 'classnames'
import moment from 'moment'
import React from 'react'

interface props {
    logs: any[]
}

const ForwardActivity = ({ logs }: props) => {
    return (
        <Card className=" overflow-scroll">
            <h5 className="mb-4">Riders Activity</h5>
            {logs?.length > 0 ? (
                <Timeline className="mb-5">
                    {logs?.map((activity: any, i: any) => (
                        <Timeline.Item
                            key={activity.status + i}
                            media={
                                <div className="flex mt-1.5">
                                    <Badge innerClass={classNames(activity.timestamp ? 'bg-emerald-500' : 'bg-blue-500')} />
                                </div>
                            }
                        >
                            <div className="font-bold text-md flex-wrap break-words">{activity?.status}</div>
                            <div className="flex-wrap break-words">{moment(activity?.timeStamp).format('DD-MM-YYYY hh:mm a')}</div>
                            <div className="font-bold text-md flex-wrap break-words">Lat:{activity?.lat}</div>
                            <div className="font-bold text-md flex-wrap break-words">Long:{activity?.long}</div>
                            <div className="font-bold text-md flex-wrap break-words">{activity?.reason}</div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            ) : (
                <>
                    <p>No Logs Available</p>
                </>
            )}
        </Card>
    )
}

export default ForwardActivity
