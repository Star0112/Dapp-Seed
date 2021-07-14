export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_NETWORK_ID, 10)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ ...NetworksData[chainId] }],
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error("Can't setup the Mainnet network on metamask because window.ethereum is undefined")
    return false
  }
}

const NetworksData = {
  1: {
    chainId: '0x1',
  },
  4: {
    chainId: '0x4',
  },
};
