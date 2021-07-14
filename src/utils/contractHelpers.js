import { getWeb3NoAccount } from './web3';
import tokenAbi from '../config/abis/token.json';
import { getTokenAddress } from './addressHelpers';

const getContract = (abi, address, web3) => {
  const _web3 = web3 ?? getWeb3NoAccount();
  return new _web3.eth.Contract(abi, address);
};

export const getTokenContract = (web3, chainId, index) => {
  return getContract(tokenAbi, getTokenAddress(chainId, index), web3);
};
