import { DUST_AMOUNT, ONE_ALPH } from '@alephium/web3';

export const CREATE_UI_FEE = ONE_ALPH;
export const HODL_TOKEN_UI_FEE = (ONE_ALPH * BigInt(50)) / BigInt(1000);
export const HODL_ALPH_UI_FEE = (amount: bigint) => {
  let fee: bigint;
  try {
    fee = (amount * BigInt(50)) / BigInt(1000);
  } catch (error) {
    return DUST_AMOUNT;
  }
  return fee > DUST_AMOUNT ? fee : DUST_AMOUNT;
};

export const ALPH_EXPLORER_URL = (network: string | null): string => {
  switch (network) {
    case '4':
      return 'https://explorer.alephium.org';
    case '5':
      return 'https://testnet.alephium.org';
    case '6':
      return 'http://localhost:23000';
    default:
      return 'https://testnet.alephium.org';
  }
};

export const ALPH_NODE_URL = (network: string | null): string => {
  switch (network) {
    case '4':
      return 'https://lb-fullnode-alephium.notrustverify.ch';
    case '5':
      return 'https://wallet.testnet.alephium.org';
    case '6':
      return 'http://localhost:22973';
    default:
      return 'https://wallet.testnet.alephium.org';
  }
};
