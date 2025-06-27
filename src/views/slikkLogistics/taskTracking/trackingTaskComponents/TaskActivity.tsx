import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import moment from 'moment'
import { TASKDETAILS } from '@/store/types/tasks.type'
import { useAppSelector } from '@/store'

const TaskActivity = () => {
    const { taskData } = useAppSelector<TASKDETAILS>((state) => state.taskData)

    const eventLogs = taskData?.event_logs ? taskData?.event_logs : []

    return (
        <Card className="mb-10 flex flex-col">
            <h5 className="mb-4">Activity</h5>

            <Timeline className="mb-5">
                {eventLogs.length === 0 ? (
                    <p>No activity data available.</p>
                ) : (
                    eventLogs.map((activity, i) => (
                        <Timeline.Item
                            key={activity.status + i}
                            media={
                                <div className="flex mt-1.5">
                                    <Badge innerClass={classNames(activity.timestamp ? 'bg-emerald-500' : 'bg-blue-500')} />
                                </div>
                            }
                        >
                            <div className="font-bold text-md">{activity.status}</div>
                            <div className="font-semibold text-sm text-red-500">{activity.failure_reason ?? ''}</div>
                            <div className="flex gap-3">
                                <span>{moment(activity.timestamp).format('DD:MM:YYYY hh:mm')}</span>{' '}
                                <span>{activity?.rto_reason ?? ''}</span>
                                <span>{activity?.RIDER ?? ''}</span>
                            </div>
                        </Timeline.Item>
                    ))
                )}
            </Timeline>
        </Card>
    )
}

export default TaskActivity
