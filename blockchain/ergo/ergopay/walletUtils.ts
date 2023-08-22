
export async function getTotalBalance(explorerClient: any, address: string): Promise<any[]>{
  const convertedResponse: any[] = [];
  const balance = (await explorerClient.getApiV1AddressesP1BalanceConfirmed(address)).data

  const ergBalance = {
    tokenId: "ERG",
    balance: balance.nanoErgs.toString(),
  };

  convertedResponse.push(ergBalance);

  for (const token of balance.tokens) {
    const tokenBalance = {
      tokenId: token.tokenId,
      balance: token.amount.toString(),
    };
    convertedResponse.push(tokenBalance);
  }

  return convertedResponse;
}