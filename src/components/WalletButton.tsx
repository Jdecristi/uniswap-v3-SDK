import { Button } from 'react-daisyui';

type WalletButtonProps = {
  signerAddress?: string;
  isConnected: () => boolean;
  toggleWalletConnection: () => void;
};

export const WalletButton: React.FC<WalletButtonProps> = ({ signerAddress, isConnected, toggleWalletConnection }) => {
  const displayAddress = `${signerAddress?.substring(0, 5)} ... ${signerAddress?.substring(signerAddress.length - 4, signerAddress.length - 1)}`;

  return isConnected() ? (
    <Button
      color="ghost"
      className="px-5 py-2 border-2 border-primary rounded-full color-primary hover:border-primary"
      onPointerDown={toggleWalletConnection}
    >
      {displayAddress}
    </Button>
  ) : (
    <Button color="primary" className="px-5 py-2 rounded-full" onPointerDown={toggleWalletConnection}>
      Connect Wallet
    </Button>
  );
};
