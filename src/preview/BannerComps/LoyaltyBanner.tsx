import React from 'react'
import LoyaltyProgress from '../components/Loyalty/LoyaltyProgress'

function LoyaltyBanner() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="h-[20px] w-full bg-primary-violet"></div>
            <LoyaltyProgress />
            <a href={'#'} className="bg-[#450029] py-2 text-[14px] w-full flex flex-row items-center justify-center space-x-1">
                <span className="text-center text-primaryWhite text-opacity-50">Learn more about our membership programme</span>
                <div>
                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.94944 1.84028C7.94944 4.62781 10.2125 6.89084 13 6.89084C10.2125 6.89084 7.94944 9.15388 7.94944 11.9414C7.94944 11.5996 7.9848 9.82571 9.41098 8.38185C10.8607 6.92031 12.6641 6.88495 13 6.88495L1.00124 6.88495"
                            stroke="#C175A2"
                            strokeWidth="1.89428"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </a>
        </div>
    )
}

export default LoyaltyBanner
