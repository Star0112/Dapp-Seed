import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import Container from '../Container';
import { useBalance, useTransfer } from '../../hooks/useTokenData';
import { useWeb3React } from '@web3-react/core';
import { Form, Button, Alert } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { getTokenAddress } from '../../utils/addressHelpers';

const TX_KEY = 'sample-transaction_history';

const HeroContainer = styled.div`
  padding: 100px 20px;
  display: flex;
  flex-direction: column;

  p {
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
  }

  ul {
    margin-top: 5px;
  }
`;
const tokenSymbols = ['SToken', 'XXX'];

const Hero = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [tokenIndex, setTokenIndex] = useState(0);

  const { account, chainId } = useWeb3React();

  const tokenBalance = useBalance(forceUpdate, tokenIndex);
  const { onTransfer, pending } = useTransfer(address, amount, tokenIndex);

  const onSubmit = async () => {
    if (!Web3.utils.isAddress(address) || address === account) {
      setIsError(true);
      setErrorMsg('Please enter a valid wallet address.');
      return;
    }

    if (!amount || amount <= 0) {
      setIsError(true);
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    if (new BigNumber(amount).times(1e18).gt(tokenBalance)) {
      setIsError(true);
      setErrorMsg('Your balance is not enough.');
      return;
    }

    setIsError(false);
    const res = await onTransfer();
    if (res) {
      NotificationManager.success('Success');
      setForceUpdate(!forceUpdate);
      const item = {
        from: account,
        to: address,
        amount,
        hash: res.transactionHash,
        name: tokenSymbols[tokenIndex],
      };
      const newHistory = [item, ...transactions];
      setTransactions(newHistory);
    } else {
      NotificationManager.error('Fail');
    }
  };

  const registerToken = useCallback(async () => {
    const tokenAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: getTokenAddress(chainId, tokenIndex),
          symbol: tokenSymbols[tokenIndex],
          decimals: 18,
        },
      },
    });

    return tokenAdded;
  }, [chainId, tokenIndex]);

  const clearTransaction = () => {
    setTransactions([]);
  };

  useEffect(() => {
    let recentTransactions = JSON.parse(window.localStorage.getItem(TX_KEY));
    if (recentTransactions) {
      setTransactions(recentTransactions);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, [transactions]);

  return (
    <Container>
      <HeroContainer>
        {account ? (
          <Form>
            {isError && <Alert variant="danger">{errorMsg}</Alert>}
            <Form.Group controlId="select">
              <Form.Label>Select Token</Form.Label>
              <Form.Control
                as="select"
                defaultValue={0}
                onChange={(e) => setTokenIndex(Number(e.target.value))}
              >
                {tokenSymbols.map((name, index) => (
                  <option value={index} key={index}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              <Form.Text className="text-muted">
                Wallet Balance: {tokenBalance.div(1e18).toFormat(2)} {tokenSymbols[tokenIndex]}
              </Form.Text>
            </Form.Group>
            {pending ? (
              <Button variant="primary">Pending</Button>
            ) : (
              <Button variant="primary" onClick={() => onSubmit()}>
                Transfer
              </Button>
            )}
            <Button
              onClick={() => registerToken()}
              variant="info"
              style={{ marginLeft: '10px' }}
            >
              Add {tokenSymbols[tokenIndex]} to your wallet
            </Button>
            {transactions.length > 0 && (
              <>
                <p>Recent Transactions</p>
                <ul>
                  {transactions.map((item, index) => (
                    <li key={index}>
                      <a
                        href={`https://rinkeby.etherscan.io/tx/${item.hash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`Sent ${item.amount} ${item.name}s from ${item.from} to ${item.to}`}
                      </a>
                    </li>
                  ))}
                </ul>
                <Button variant="danger" onClick={() => clearTransaction()}>
                  Clear
                </Button>
              </>
            )}
          </Form>
        ) : (
          <Alert variant="warning">
            Please connect your wallet and select the Rinkeby Test Network.
          </Alert>
        )}
      </HeroContainer>
    </Container>
  );
};

export default Hero;
