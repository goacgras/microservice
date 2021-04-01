import React from "react";
import { OrderInput } from "../generated/graphql";

interface ShoppingCartProps {
    orders: OrderInput[];
}
const ShoppingCart: React.FC<ShoppingCartProps> = ({ orders }) => {
    return (
        <div className='flex flex-row p-2 px-4 truncate rounded cursor-pointer'>
            <div></div>
            <div className='flex flex-row-reverse w-full ml-2'>
                <div
                    slot='icon'
                    className='relative'
                    // onClick={() => setModal(true)}
                >
                    <div className='absolute top-0 right-0 px-1 -mt-1 -mr-2 text-xs font-bold text-white bg-red-700 rounded-full'>
                        {orders.length}
                    </div>

                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='100%'
                        height='100%'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='w-6 h-6 mt-2 feather feather-shopping-cart'
                    >
                        <circle cx='9' cy='21' r='1'></circle>
                        <circle cx='20' cy='21' r='1'></circle>
                        <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
