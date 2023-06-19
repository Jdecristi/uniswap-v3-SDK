import { WalletButton } from '@src/components/WalletButton';
import { BrowserProvider, Eip1193Provider, ethers, JsonRpcSigner } from 'ethers';
import { useEffect, useState } from 'react';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [signerAddress, setSignerAddress] = useState<string>();

  useEffect(() => {
    (async () => {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
      setProvider(ethersProvider);
    })();
  }, []);

  const getSigner = async (provider: BrowserProvider) => {
    const ethersSigner = await provider.getSigner();

    setSigner(ethersSigner);
  };

  const getWalletAddress = async (signer: JsonRpcSigner) => {
    const walletAddress = await signer.getAddress();

    setSignerAddress(walletAddress);

    // TODO: Connect weth and uni contracts
  };

  const toggleWalletConnection = () => {
    if (isConnected()) {
      setSigner(undefined);
    } else {
      if (provider) getSigner(provider);
    }
  };

  const isConnected = () => signer !== undefined;

  if (signer !== undefined) getWalletAddress(signer);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <WalletButton {...{ signerAddress, isConnected, toggleWalletConnection }} />
    </main>
  );
}
