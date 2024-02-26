import React from 'react';

interface IProps {
  title: string;
  text: string;
}

const HeaderCards = (props: IProps) => {
  const { title, text } = props;
  return (
    <>
      <article className="text-start w-full bg-gray-200 p-3 font-inter flex items-center justify-between">
        <span className="font-light text-black text-sm">{title}</span>
        <p className="font-bold text-base lg:text-lg text-black pr-1">{text}</p>
      </article>
    </>
  );
};

export default HeaderCards;
