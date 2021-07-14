import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const POLLING_INTERVAL = 12000

const supportedChainIds = [
  // 1, // Mainnet
  4, // Rinkeby
];

export const injected = new InjectedConnector({
  supportedChainIds,
});

const chainId = parseInt(process.env.REACT_APP_NETWORK_ID, 10);
const rpcUrl = process.env.REACT_APP_MAIN_WEB3_PROVIDER;

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const ConnectorNames = {
  Injected: 'MetaMask',
  WalletConnect: 'walletconnect',
};

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
};

export const connectorLocalStorageKey = "connectorId";
