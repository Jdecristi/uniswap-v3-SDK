import React from 'react';
import { Select } from 'react-daisyui';

type ConfigModalProps = {
  close: () => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
  slippageAmount: number;
  setSlippageAmount: (amount: number) => void;
};

export const ConfigModal: React.FC<ConfigModalProps> = ({ close, deadline, setDeadline, slippageAmount, setSlippageAmount }) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-dark bg-opacity-50" onPointerDown={close}>
      <div className="flex flex-col gap-5 p-5 rounded-xl bg-dark" onPointerDown={(e) => e.stopPropagation()}>
        <h1 className="text-2xl">Transaction Settings</h1>
        <div className="flex gap-32">
          <span>Deadline</span>
          <Select size="sm" value={deadline} onChange={(event) => setDeadline(Number(event.target.value))}>
            <option value={30}>30 Sec</option>
            <option value={60}>1min</option>
            <option value={300}>5 min</option>
            <option value={600}>10 Min</option>
            <option value={1800}>30 Min</option>
            <option value={3600}>1 hr</option>
          </Select>
        </div>
        <div className="flex gap-32">
          <span>Slippage</span>
          <Select size="sm" value={slippageAmount} onChange={(event) => setSlippageAmount(Number(event.target.value))}>
            <option value={1}>1%</option>
            <option value={2}>2%</option>
            <option value={3}>3%</option>
            <option value={4}>4%</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
