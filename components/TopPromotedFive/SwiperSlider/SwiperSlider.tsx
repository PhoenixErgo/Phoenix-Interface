'use client'
import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import TopItem from '../TopItem/TopItem'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Dummy images data
const top5Data = [
    { id: 1001, token: "COMET", title: "hodlCOMET", bankFee: 3, amount: 100 },
    { id: 1002, token: "SigUSD", title: "hodlSigUSD", bankFee: 4, amount: 200 },
    { id: 1003, token: "SigUSD", title: "hodlSigUSD", bankFee: 14, amount: 300 },
    { id: 1004, token: "SPF", title: "hodlSPF", bankFee: 2, amount: 400 },
    { id: 1005, token: "SPF", title: "hodlSPF", bankFee: 20, amount: 500 },
    // Add more tokens if needed
];

export function SwiperSlider() {

    return (
        <section>
            <div className='container my-5'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    freeMode={true}
                    rewind={true}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        // 368: {
                        //     slidesPerView: 1,
                        //     spaceBetween: 10,
                        // },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        },
                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 50,
                        },
                    }}
                    navigation



                    modules={[Navigation, Pagination]}
                    className='mySwiper h-wrap w-full '
                >
                    {top5Data.map((item, index) => (
                        <SwiperSlide key={index} >
                            <TopItem
                                title={item.title}
                                bankFee={item.bankFee}
                                token={item.token}
                                amount={item.amount}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}


export default SwiperSlider;
