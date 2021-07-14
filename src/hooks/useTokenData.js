import { useEffect, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import useRefresh from './useRefresh';
import { useToken } from './useContract';

export const useAllowance = (targetAddress, forceUpdate) => {
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const { account, chainId } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const tokenContract = useToken();

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        const res = await tokenContract.methods.allowance(account, targetAddress).call();
        setAllowance(new BigNumber(res));
      } catch (e) {
        console.error('fetch token allowance had error', e);
      }
    };
    if (account && tokenContract && Web3.utils.isAddress(targetAddress)) {
      fetchAllowance();
    }
    console.log('callled 2');
  }, [account, tokenContract, chainId, targetAddress, fastRefresh, forceUpdate]);

  return allowance;
};

export const useApprove = (targetAddress, amount) => {
  const { account } = useWeb3React();
  const contract = useToken();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await contract.methods
        .approve(targetAddress, new BigNumber(amount).times(1e18).toString())
        .send({ from: account });
      return tx;
    } catch (e) {
      console.log('token approve had error :>> ', e);
      return false;
    }
  }, [account, contract, targetAddress, amount]);

  return { onApprove: handleApprove };
};

export const useTransfer = (targetAddress, amount, index) => {
  const [pending, setPending] = useState(false);
  const { account } = useWeb3React();
  const contract = useToken(index);

  const handleTransfer = useCallback(async () => {
    try {
      setPending(true);
      const tx = await contract.methods
        .transfer(targetAddress, new BigNumber(amount).times(1e18).dp(0).toString(10))
        .send({ from: account });
      setPending(false);
      return tx;
    } catch (e) {
      console.log('token transfer had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract, targetAddress, amount]);

  return { onTransfer: handleTransfer, pending };
};

export const useBalance = (forceUpdate, index) => {
  const [tokenBalance, setTokenBalance] = useState(new BigNumber(0));

  const { account, chainId } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const tokenContract = useToken(index);

  useEffect(() => {
    const getTokenInfo = async () => {
      try {
        const res = await tokenContract.methods.balanceOf(account).call();
        setTokenBalance(new BigNumber(res));
      } catch (e) {
        console.error('fetch token balance had error', e);
      }
    };
    if (account && tokenContract) {
      getTokenInfo();
    } else {
      setTokenBalance(new BigNumber(0));
    }
  }, [account, chainId, fastRefresh, tokenContract, forceUpdate]);

  return tokenBalance;
};
