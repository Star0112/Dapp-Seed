import addresses from '../config/constants/contracts'

export const getTokenAddress = (chainId = 4, index = 0) => {
  return index === 0 ? addresses.token[chainId] : addresses.second[chainId]
}
