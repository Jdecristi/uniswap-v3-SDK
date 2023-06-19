import { JsonRpcSigner } from 'ethers';
import React, { ChangeEvent } from 'react';
import { Button } from 'react-daisyui';
import { MdKeyboardArrowDown } from 'react-icons/md';

type CurrencyInputProps = {
  field: 'input' | 'output';
  balance: string;
  token?: string;
  signer?: JsonRpcSigner;
  value: string;
  setValue: (value: string) => void;
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ token, balance, value, setValue }) => {
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value
      // Remove anything that isn't valid in a number
      .replace(/[^\d-.]/g, '')
      // Remove all dashes
      .replace(/-|\s/, '')
      // Remove all periods unless it is the last one
      .replace(/\.(?=.*\.)/g, '');

    if (value === '0') return setValue(e.target.value.substring(1));
    if (!e.target.value.length) return setValue('0');
    setValue(e.target.value);
  };

  return (
    <>
      <div className="rounded-xl bg-light py-3 px-3 ">
        <div className="flex justify-between items-center">
          <input type="text" size={12} className="text-4xl bg-transparent focus:outline-none" value={value} onChange={handleInput} />

          {token ? (
            <Button endIcon={<MdKeyboardArrowDown className="text-lg" />} color="primary" size="sm" className="bg-opacity-5 rounded-full">
              {token}
            </Button>
          ) : (
            <Button endIcon={<MdKeyboardArrowDown className="text-lg" />} color="primary" size="sm" className="rounded-full">
              Select Token
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="h-6" />
          <span className="h-6">Balance: {Number(balance).toFixed(3) || 0}</span>
        </div>
      </div>
    </>
  );
};
