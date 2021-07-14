require('dotenv').config();

const web3Provider =
  process.env.REACT_APP_NETWORK_ID === '1'
    ? process.env.REACT_APP_MAIN_WEB3_PROVIDER
    : process.env.REACT_APP_RINKEBY_WEB3_PROVIDER;

const config = {
  web3Provider: web3Provider || '',
  networkId: Number(process.env.REACT_APP_NETWORK_ID) || 1,
};

module.exports = config;
