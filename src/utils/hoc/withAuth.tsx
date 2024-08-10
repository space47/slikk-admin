import { FC, useEffect, useState } from 'react'

const withAuth = (Component: FC<any>) => (props: any) => {
    console.log(Component)
    console.log('props', props)
    //const  [innerWidth, setInnerWidth] = useState(0);

    useEffect(() => {}, [])

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Welcome To Slikk!</h3>
                <p>Please enter your mobile number to sign in!</p>
            </div>
            <Component {...props} />
        </>
    )
}

export default withAuth
