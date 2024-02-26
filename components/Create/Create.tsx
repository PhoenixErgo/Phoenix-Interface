import React from 'react';
import CreateForm from './ui/alephium/CreateForm';

interface IProps {
  network: string | null;
}
const Create = (props: IProps) => {
  const { network } = props;

  return (
    <>
      <div className="min-h-[70vh]">
        <div className="lg:flex items-start px-2 sm:px-3 my-2 lg:my-10">
          <CreateForm network={network} />
        </div>
      </div>
    </>
  );
};

export default Create;
