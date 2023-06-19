/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModal } from '@src/components/ConfigModal';
import { CurrencyInput } from '@src/components/CurrencyInput';
import { WalletButton } from '@src/components/WalletButton';
import { BrowserProvider, Eip1193Provider, ethers, JsonRpcSigner } from 'ethers';
import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
// eslint-disable-next-line import/no-unresolved
import { IComponentBaseProps } from 'react-daisyui/dist/types';
import { BsFillGearFill } from 'react-icons/bs';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import { ImSpinner8 } from 'react-icons/im';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [signerAddress, setSignerAddress] = useState<string>();
  const [configModal, setConfigModalOpen] = useState<boolean>(false);

  const [loading] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<number>(60);
  const [slippageAmount, setSlippageAmount] = useState<number>(0.1);

  const [token0Symbol, setToken0Symbol] = useState<string>('ETH');
  const [token0Amount, setToken0Amount] = useState<string>('0');
  const [token0Balance, setToken0Balance] = useState<string>('0');

  const [token1Symbol, setToken1Symbol] = useState<string>();
  const [token1Amount, setToken1Amount] = useState<string>('0');
  const [token1Balance, setToken1Balance] = useState<string>('0');

  const getSigner = async (provider: BrowserProvider) => {
    const ethersSigner = await provider.getSigner();

    setSigner(ethersSigner);
  };

  const getWalletAddress = async (signer: JsonRpcSigner) => {
    const walletAddress = await signer.getAddress();

    setSignerAddress(walletAddress);

    // TODO: Connect token0 and token1 contracts
  };

  const toggleWalletConnection = () => {
    if (isConnected()) {
      setSigner(undefined);
    } else {
      if (provider) getSigner(provider);
    }
  };

  const isConnected = () => signer !== undefined;

  useEffect(() => {
    (async () => {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
      setProvider(ethersProvider);
    })();
  }, []);

  useEffect(() => {
    if (signer !== undefined) getWalletAddress(signer);
  }, [signer]);

  const setInputAmount = (amount: string) => {
    setToken0Amount(amount);

    // Todo: Check if tokens are set to get quote
  };

  const setOutputAmount = (amount: string) => {
    setToken1Amount(amount);

    // Todo: Check if tokens are set to get quote
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        <header className="flex py-5 items-center justify-end px-10">
          <WalletButton buttonProps={{ size: 'sm' } as IComponentBaseProps} {...{ signerAddress, isConnected, toggleWalletConnection }} />
        </header>
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 rounded-3xl bg-dark p-2">
          <div className="flex items-center justify-between p-2">
            <h1 className="text-xl">Swap</h1>
            <BsFillGearFill className="text-xl cursor-pointer" onPointerDown={() => setConfigModalOpen(true)} />
          </div>
          <div className="flex flex-col gap-2 py-2 relative">
            <CurrencyInput
              field="input"
              signer={signer}
              balance={token0Balance}
              token={token0Symbol}
              value={token0Amount}
              setValue={setInputAmount}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark p-1 rounded-lg">
              <div className="p-2 bg-neutral rounded-lg">
                {loading ? <ImSpinner8 className="animate-spin text-xl" /> : <HiOutlineSwitchVertical className="text-xl" />}
              </div>
            </div>
            <CurrencyInput field="input" signer={signer} balance={token1Balance} value={token1Amount} setValue={setOutputAmount} />
          </div>
          {isConnected() ? (
            <Button color="primary" size="lg" className="rounded-2xl w-full">
              Swap
            </Button>
          ) : (
            <WalletButton
              className="w-full rounded-2xl"
              buttonProps={{ size: 'lg' } as IComponentBaseProps}
              {...{ signerAddress, isConnected, toggleWalletConnection }}
            />
          )}
        </div>
      </main>
      {configModal && (
        <ConfigModal
          close={() => setConfigModalOpen(false)}
          deadline={deadline}
          setDeadline={setDeadline}
          slippageAmount={slippageAmount}
          setSlippageAmount={setSlippageAmount}
        />
      )}
    </>
  );
}
