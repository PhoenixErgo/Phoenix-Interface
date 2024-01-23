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
            <article className="text-start w-full bg-gray-200 p-3 font-inter">
                <div className="text-black text-sm font-light">{title}</div>
                <span className="font-bold text-xl xl:text-2xl text-black pr-1">{amount}</span><span>{token}</span>
            </article>
        </>
    );
};

export default HeaderCardsV2;
