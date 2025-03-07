import RLogin from '@rsksmart/rlogin'
import { IProviderOptions } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Portis from '@portis/web3'
import { trezorProviderOptions } from '@rsksmart/rlogin-trezor-provider'
import { ledgerProviderOptions } from '@rsksmart/rlogin-ledger-provider'
import { dcentProviderOptions } from '@rsksmart/rlogin-dcent-provider'

export type RPCUrls = { [chainId: number]: string }

export const rskMainnetRpcUrl: RPCUrls = {
  30: 'https://public-node.rsk.co'
}

export const rskTestnetRpcUrl: RPCUrls = {
  31: 'https://public-node.testnet.rsk.co'
}

export const rskRpcUrls: RPCUrls = Object.assign({}, rskMainnetRpcUrl, rskTestnetRpcUrl)

const rifTrezorOptions: {
  manifestEmail: string;
  manifestAppUrl: string; // TODO: export this type
} = {
  manifestEmail: 'info@iovlabs.org',
  manifestAppUrl: 'https://rifos.org'
}

export const createRLogin = (rpcUrls = rskRpcUrls, trezorOptions = rifTrezorOptions) => {
  const providerOptions = Object.assign({
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: rpcUrls,
        bridge: 'https://walletconnect-bridge.rifos.org/'
      }
    },
    'custom-ledger': ledgerProviderOptions,
    'custom-dcent': dcentProviderOptions,
    'custom-trezor': {
      ...trezorProviderOptions,
      options: trezorOptions
    }
  }, rpcUrls[31]
    ? {
        portis: {
          package: Portis,
          options: {
            id: 'bb40ce05-67d3-48d0-85ca-92536952f38e',
            network: {
              nodeUrl: rpcUrls[31],
              chainId: 31
            }
          }
        }
      }
    : {} as IProviderOptions)

  const supportedChains = Object.keys(rpcUrls).map(Number)

  return new RLogin(({
    cacheProvider: false,
    providerOptions,
    rpcUrls,
    supportedChains
  }))
}
