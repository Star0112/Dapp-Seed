import Web3 from 'web3'
import config from '../config';

const RPC_URL = {
  1: process.env.REACT_APP_MAIN_WEB3_PROVIDER,
  4: process.env.REACT_APP_RINKEBY_WEB3_PROVIDER
}

const getWeb3NoAccount = () => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL[config.networkId], { timeout: 10000 })
  const web3NoAccount = new Web3(httpProvider)
  return web3NoAccount
}

export { getWeb3NoAccount }