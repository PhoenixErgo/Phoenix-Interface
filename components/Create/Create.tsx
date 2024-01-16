import React from "react";
import CreateForm from "./ui/CreateForm";

interface IProps {
    ergdata: any;
}
const Create = (props: IProps) => {
    const { ergdata } = props;

    return (
        <>
            <div className="min-h-[70vh]">
                <div className="lg:flex items-start px-2 sm:px-3 my-10 lg:my-20">
                    <CreateForm />
                </div>
            </div>
        </>
    );
};

export default Create;
