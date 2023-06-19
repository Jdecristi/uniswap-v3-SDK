import { Button } from 'react-daisyui';
// eslint-disable-next-line import/no-unresolved
import { IComponentBaseProps } from 'react-daisyui/dist/types';

type WalletButtonProps = {
  className?: string;
  signerAddress?: string;
  isConnected: () => boolean;
  toggleWalletConnection: () => void;
  buttonProps?: IComponentBaseProps;
};

export const WalletButton: React.FC<WalletButtonProps> = ({ className, buttonProps, signerAddress, isConnected, toggleWalletConnection }) => {
  const displayAddress = `${signerAddress?.substring(0, 5)} ... ${signerAddress?.substring(signerAddress.length - 4, signerAddress.length - 1)}`;

  return isConnected() ? (
    <Button
      color="ghost"
      {...buttonProps}
      className="px-5 py-2 border-2 border-primary rounded-full color-primary hover:border-primary"
      onPointerDown={toggleWalletConnection}
    >
      {displayAddress}
    </Button>
  ) : (
    <Button {...buttonProps} color="primary" className={`px-5 py-2 rounded-full ${className}`} onPointerDown={toggleWalletConnection}>
      Connect Wallet
    </Button>
  );
};
