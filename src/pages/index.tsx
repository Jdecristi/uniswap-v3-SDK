/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModal } from '@src/components/ConfigModal';
import { CurrencyInput } from '@src/components/CurrencyInput';
import { WalletButton } from '@src/components/WalletButton';
import { getExactInputPrice, getExactOutputPrice, runSwap } from '@src/helpers/AlfaRouterService';
import { debounce } from '@src/helpers/debounce';
import { getUniContract, getWethContract, UNI, WETH } from '@src/helpers/Tokens';
import { Token } from '@uniswap/sdk-core';
import { BigNumber, Contract, ethers, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { Button, Swap } from 'react-daisyui';
// eslint-disable-next-line import/no-unresolved
import { IComponentBaseProps } from 'react-daisyui/dist/types';
import { BsFillGearFill } from 'react-icons/bs';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import { ImSpinner8 } from 'react-icons/im';

export default function Home() {
  const [provider, setProvider] = useState<providers.Web3Provider>();
  const [signer, setSigner] = useState<providers.JsonRpcSigner>();
  const [signerAddress, setSignerAddress] = useState<string>();
  const [configModal, setConfigModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<number>(60);
  const [slippageAmount, setSlippageAmount] = useState<number>(1);

  const [token0, setToken0] = useState<Token>(WETH);
  const [token0Amount, setToken0Amount] = useState<string>('0');
  const [token0Balance, setToken0Balance] = useState<string>('0');
  const [token0Contract, setToken0Contract] = useState<Contract>();

  const [token1, setToken1] = useState<Token>(UNI);
  const [token1Amount, setToken1Amount] = useState<string>('0');
  const [token1Balance, setToken1Balance] = useState<string>('0');
  const [token1Contract, setToken1Contract] = useState<Contract>();

  const [transaction, setTransaction] = useState<{
    to: string;
    from: string;
    gasPrice: BigNumber;
    gasLimit: string;
  }>();
  const [quote, setQuote] = useState<string>();
  const [ratio, setRatio] = useState<string>();

  const getSigner = async (provider: providers.Web3Provider) => {
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (err) {
      console.error(err);
    }
    const ethersSigner = await provider.getSigner();

    setSigner(ethersSigner);
  };

  const getWalletAddress = async (signer: providers.JsonRpcSigner) => {
    const walletAddress = await signer.getAddress();

    setSignerAddress(walletAddress);

    setToken0Balance(ethers.utils.formatEther(await token0Contract?.balanceOf(walletAddress)));
    setToken1Balance(ethers.utils.formatEther(await token1Contract?.balanceOf(walletAddress)));
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
      // ts-ignore
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum as unknown as providers.ExternalProvider);
      setProvider(ethersProvider);

      setToken0Contract(getWethContract());
      setToken1Contract(getUniContract());
    })();
  }, []);

  useEffect(() => {
    if (signer !== undefined) getWalletAddress(signer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  const setInputAmount = (amount: string) => {
    setToken0Amount(amount);

    if (signerAddress) {
      const deadlineDate = Math.floor(Date.now() / 1000 + deadline);

      setLoading(true);
      setTransaction(undefined);

      debounce(
        (async () => {
          const inputQuote = await getExactInputPrice(token0, token1, amount, signerAddress);

          if (inputQuote) {
            setTransaction(inputQuote.transaction);
            setQuote(inputQuote.quote);
            setRatio(inputQuote.ratio);

            setToken1Amount(inputQuote.quote);
          }

          setLoading(false);

          console.log(inputQuote);
        })()
      );
    }
  };

  const handleSwap = () => {
    if (transaction && signer) {
      runSwap(transaction, signer);
    }
  };

  const switchTokens = () => {
    setToken0(token1);
    setToken0Amount(token1Amount);
    setToken0Balance(token1Balance);
    setToken0Contract(token1Contract);
    setToken1(token0);
    setToken1Amount(token0Amount);
    setToken1Balance(token0Balance);
    setToken1Contract(token0Contract);
  };

  const setOutputAmount = (amount: string) => {
    setToken1Amount(amount);

    if (signerAddress) {
      const deadlineDate = Math.floor(Date.now() / 1000 + deadline);

      setLoading(true);
      setTransaction(undefined);

      debounce(
        (async () => {
          const outputQuote = await getExactOutputPrice(token0, token1, amount, signerAddress);

          if (outputQuote) {
            setTransaction(outputQuote.transaction);
            setToken0Amount(outputQuote.quote);
            setRatio(outputQuote.ratio);
          }

          setLoading(false);

          console.log(outputQuote);
        })()
      );
    }
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
            <CurrencyInput field="input" balance={token0Balance} token={token0.symbol} value={token0Amount} setValue={setInputAmount} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark p-1 rounded-lg">
              <div className="p-2 bg-neutral rounded-lg">
                {loading ? (
                  <ImSpinner8 className="animate-spin text-xl" />
                ) : (
                  <HiOutlineSwitchVertical className="text-xl" onPointerDown={switchTokens} />
                )}
              </div>
            </div>
            <CurrencyInput field="input" balance={token1Balance} token={token1.symbol} value={token1Amount} setValue={setOutputAmount} />
          </div>
          {ratio && (
            <span className="h-6 my-2 ml-3">
              1 {token0.symbol} = {ratio + token1.symbol}
            </span>
          )}
          {isConnected() ? (
            <Button color="primary" size="lg" className="rounded-2xl w-full" disabled={!transaction || !isConnected()} onPointerDown={handleSwap}>
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
