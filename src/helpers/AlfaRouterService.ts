import { getWethContract } from '@src/helpers/Tokens';
import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter } from '@uniswap/smart-order-router';
import { BigNumber, ethers } from 'ethers';
import JSBI from 'jsbi';

const V3_SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
const RPC_URL = 'https://eth-goerli.g.alchemy.com/v2/demo	';

const chainId = 5;

export const web3Provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });

export const getExactInputPrice = async (inputToken: Token, outputToken: Token, inputAmount: string, walletAddress: string) => {
  const wei = ethers.utils.parseUnits(inputAmount, inputToken.decimals);
  const currencyAmount = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(wei));

  console.log(walletAddress);

  try {
    const route = await router.route(currencyAmount, outputToken, TradeType.EXACT_INPUT);

    if (route) {
      const transaction = {
        to: V3_SWAP_ROUTER_ADDRESS,
        from: walletAddress,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: ethers.utils.hexlify(1000000),
      };

      const quote = route.quote.toFixed(6);
      const ratio = (Number(quote) / Number(inputAmount)).toFixed(3);

      return { transaction, quote, ratio };
    }
  } catch (err) {
    console.log(err);
  }
};
export const getExactOutputPrice = async (inputToken: Token, outputToken: Token, inputAmount: string, walletAddress: string) => {
  const wei = ethers.utils.parseUnits(inputAmount, inputToken.decimals);
  const currencyAmount = CurrencyAmount.fromRawAmount(outputToken, JSBI.BigInt(wei));

  console.log(walletAddress);

  try {
    const route = await router.route(currencyAmount, inputToken, TradeType.EXACT_OUTPUT);

    if (route) {
      const transaction = {
        to: V3_SWAP_ROUTER_ADDRESS,
        from: walletAddress,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: ethers.utils.hexlify(1000000),
      };

      const quote = route.quote.toFixed(6);
      const ratio = (Number(inputAmount) / Number(quote)).toFixed(3);

      return { transaction, quote, ratio };
    }
  } catch (err) {
    console.log(err);
  }
};

export const runSwap = async (
  transaction: {
    to: string;
    from: string;
    gasPrice: BigNumber;
    gasLimit: string;
  },
  signer: ethers.providers.JsonRpcSigner
) => {
  const approvalAmount = ethers.utils.parseUnits('10', 18).toString();
  const contract0 = getWethContract();
  await contract0.connect(signer).approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

  signer.sendTransaction(transaction);
};
