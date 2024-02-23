import React from "react";

interface IProps {
    title: string;
    amount: number;
    token: string;
}

const HeaderCardsV2 = (props: IProps) => {
    const { title, amount, token } = props;
    return (
        <>
            <article className="text-start w-full bg-gray-200 p-3 font-inter flex items-center justify-between">
                <div className=" text-black text-sm">{title}</div>
                <div className="flex flex-col items-end">
                    <span className="font-bold text-base lg:text-lg text-black pr-1">{amount}{" "}</span>
                    <span className="font-thin lg:text-s text-black pr-1">{token}</span>
                </div>
            </article>
        </>
    );
};

export default HeaderCardsV2;
