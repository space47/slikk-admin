/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'

export const ridersService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        addRiders: builder.mutation<{ success: string }, { mobile: number; task_id: number }>({
            query: (params) => {
                return {
                    url: `logistic/slikk/task/${params.task_id}`,
                    method: 'POST',
                    body: { action: 'assign_rider', rider_mobile: params.mobile },
                }
            },
        }),
    }),
})
