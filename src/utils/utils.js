const BigNumber = require('bignumber.js');

const sendTransaction = async (
  fromAddress,
  toAddress,
  encodedABI,
  successCallBack,
  errorCallBack,
  wei = `0x0`,
) => {
  const web3 = window.web3;
  if (window.ethereum && web3) {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const tx = {
        from: fromAddress,
        to: toAddress,
        // gas: gasLimit,
        gasPrice: web3.utils.toHex(gasPrice), //`0xAB5D04C00`,
        data: encodedABI,
        value: wei,
      };
      web3.eth
        .sendTransaction(tx)
        .on('transactionHash', () => {})
        .on('receipt', (res) => {
          successCallBack(res);
        })
        .on('error', (err) => {
          errorCallBack(err);
        });
    } catch (err) {
      console.log('err :>> ', err);
      return null;
    }
  } else {
    return null;
  }
};

const bnToDec = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

const bnDivdedByDecimals = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals));
};

const bnMultipledByDecimals = (bn, decimals = 18) => {
  return bn.multipliedBy(new BigNumber(10).pow(decimals));
};

const decToBn = (dec, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

const getStaked = async (pid, account, farmContract) => {
  try {
    const { amount } = await farmContract.methods.userInfo(pid, account).call();
    return new BigNumber(amount);
  } catch (error) {
    return new BigNumber(0);
  }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const formatDecimal = (value, decimal = 18, numPoint = 4, precision = 2) => {
  const data = new BigNumber(value).dividedBy(new BigNumber(10).pow(decimal));
  if (data.isGreaterThan(1)) {
    return numberWithCommas(data.dp(precision, 1).toNumber());
  }
  return data.dp(numPoint, 1).toNumber();
};

const callMethod = async (method, args = []) => {
  // eslint-disable-next-line no-return-await
  return await method(...args).call();
}

export {
  sendTransaction,
  bnToDec,
  bnDivdedByDecimals,
  bnMultipledByDecimals,
  decToBn,
  getStaked,
  formatDecimal,
  callMethod,
};
