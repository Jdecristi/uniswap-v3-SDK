import React, { ChangeEvent } from 'react';

type CurrencyInputProps = {
  field: 'input' | 'output';
  balance: string;
  token?: string;
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

    if (!e.target.value.length) return setValue('0');
    setValue(e.target.value);
  };

  return (
    <>
      <div className="rounded-xl bg-light py-3 px-3 ">
        <div className="flex justify-between items-center">
          <input type="text" size={12} className="text-4xl bg-transparent focus:outline-none" value={value} onChange={handleInput} />
          <span className="text-2xl font-semibold">{token}</span>
        </div>
        <div className="flex justify-end items-center">
          <span className="h-6">Balance: {Number(balance).toFixed(3) || 0}</span>
        </div>
      </div>
    </>
  );
};
