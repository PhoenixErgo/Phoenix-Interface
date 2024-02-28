import React, { useState, useRef, useEffect } from 'react';
import TopItem from '../TopItem/TopItem';

interface TopData {
  id: number;
  token: string;
  title: string;
  bankFee: number;
  amount: number;
}

const top5Data: TopData[] = [
  { id: 1001, token: 'COMET', title: 'hodlCOMET', bankFee: 3, amount: 100 },
  { id: 1002, token: 'SigUSD', title: 'hodlSigUSD', bankFee: 4, amount: 200 },
  { id: 1003, token: 'SigUSD', title: 'hodlSigUSD', bankFee: 14, amount: 300 },
  { id: 1004, token: 'SPF', title: 'hodlSPF', bankFee: 17, amount: 400 },
  { id: 1005, token: 'SPF', title: 'hodlSPF', bankFee: 20, amount: 500 }
  // Add more tokens if needed
];

const TopSlider: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    if (sliderRef.current) {
      setStartX(event.pageX - sliderRef.current.offsetLeft);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging || !sliderRef.current) return;
    const x = event.pageX - sliderRef.current.offsetLeft;
    const distance = x - (startX as number);
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= distance;
    }
    setStartX(x);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrevClick = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft === 0) {
        sliderRef.current.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: 'smooth'
        });
      } else {
        sliderRef.current.scrollTo({
          left: Math.max(0, scrollLeft - 370),
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth === scrollWidth) {
        sliderRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        sliderRef.current.scrollTo({
          left: Math.min(scrollWidth - clientWidth, scrollLeft + 370),
          behavior: 'smooth'
        });
      }
    }
  };




  return (
    <section className='top-slider py-5 relative'>
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="slider-container flex w-[90vw] lg:w-[1090px] overflow-x-auto "
        style={{
          paddingBottom: '20px', // Adjust this value according to your scrollbar width
          WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
          '-ms-overflow-style': 'none' // Hide scrollbar for Internet Explorer and Edge
        }}
      >
        {top5Data.map((item) => (
          <div key={item.id} className='mx-2'>
            <TopItem
              title={item.title}
              bankFee={item.bankFee}
              token={item.token}
              amount={item.amount}
            />
          </div>
        ))}

      </div>
      <button
        className="absolute top-[50px] -left-[60px] hidden lg:block w-20 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
        onClick={handlePrevClick}
      >
        PREV
      </button>
      <button
        className="absolute top-[50px] -right-[60px] hidden lg:block w-20 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
        onClick={handleNextClick}
      >
        NEXT
      </button>
    </section>
  );
}

export default TopSlider;
