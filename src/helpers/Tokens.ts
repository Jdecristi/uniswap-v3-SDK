import { web3Provider } from '@src/helpers/AlfaRouterService';
import ERC20ABI from '@src/helpers/ERC20.json';
import { ChainId, Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';

const name0 = 'Wrapped Ether';
const symbol0 = 'WETH';
const decimals0 = 18;
const address0 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';

const name1 = 'Uniswap Token';
const symbol1 = 'UNI';
const decimals1 = 18;
const address1 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

export const WETH = new Token(ChainId.GOERLI, address0, decimals0, symbol0, name0);
export const UNI = new Token(ChainId.GOERLI, address1, decimals1, symbol1, name1);

export const getWethContract = () => new ethers.Contract(address0, ERC20ABI, web3Provider);
export const getUniContract = () => new ethers.Contract(address1, ERC20ABI, web3Provider);
