import algosdk from 'algosdk';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { Buffer } from 'buffer';
import { sign } from 'crypto';

const token = {
  'X-API-key': process.env.REACT_APP_PURESTACK_API_TOKEN,
}

const port = '';
const server = 'https://testnet-algorand.api.purestake.io/ps2';

export const algodClient = new algosdk.Algodv2(
  token,
  server,
  port
);
if (!window.Buffer) window.Buffer = Buffer;
export const transferAlgo = async (from, to, amount) => {
  try {
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: from,
      to: to,
      amount: amount,
      note: undefined
    });

    const myAlgoConnect = new MyAlgoConnect();
    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    await algodClient.sendRawTransaction(signedTxn.blob).do()
    let txId = txn.txID().toString()
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    console.log(
      `Transaction ${txId} confirmed in round ${confirmedTxn['confirmed-round']}\n`
    );
    return true
  } catch (err) {
    console.log(err)
    return false;
  }
}
export const transferAlgo_pera = async (from, to, amount) => {
  try {
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: from,
      to: to,
      amount: amount,
      note: undefined
    });


    const peraWallet = new PeraWalletConnect();
    const signedTxn = await peraWallet.signTransaction([[{ txn, signers: [from] }]]);
    console.log(signedTxn)
    await algodClient.sendRawTransaction(signedTxn).do()
    let txId = txn.txID().toString()
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    console.log(
      `Transaction ${txId} confirmed in round ${confirmedTxn['confirmed-round']}\n`
    );
    return true
  } catch (err) {
    console.log(err)
    return false;
  }
}
export const transferUSDC = async (from, to, amount) => {

  try {
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: from,
      to: to,
      assetIndex: parseInt(process.env.REACT_APP_USDC_ADDRESS),
      amount: amount,
      note: undefined
    });
    const myAlgoConnect = new MyAlgoConnect();
    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    await algodClient.sendRawTransaction(signedTxn.blob).do()
    let txId = txn.txID().toString()
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    console.log(
      `Transaction ${txId} confirmed in round ${confirmedTxn['confirmed-round']}\n`
    );
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const transferUSDC_pera = async (from, to, amount) => {

  try {
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: from,
      to: to,
      assetIndex: parseInt(process.env.REACT_APP_USDC_ADDRESS),
      amount: amount,
      note: undefined
    });
    
    const peraWallet = new PeraWalletConnect();
    const signedTxn = await peraWallet.signTransaction([[{ txn, signers: [from] }]]);
    console.log(signedTxn)
    await algodClient.sendRawTransaction(signedTxn).do()
    let txId = txn.txID().toString()
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    console.log(
      `Transaction ${txId} confirmed in round ${confirmedTxn['confirmed-round']}\n`
    );
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const transferAsset = async (from, to, assetIndex, amount, note) => {
  try {
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: from,
      to: to,
      assetIndex: parseInt(assetIndex),
      amount: amount,
      note: note
    });
    const myAlgoConnect = new MyAlgoConnect();
    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    await algodClient.sendRawTransaction(signedTxn.blob).do();
    let txId = txn.txID().toString()
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    console.log(
      `Transaction ${txId} confirmed in round ${confirmedTxn['confirmed-round']}\n`
    );
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}

// const algod = new algosdk.Algodv2("", CLIENT_SERVER_URL, CLIENT_SERVER_PORT);

export const transferAsset_pera = async (from, to, assetIndex, amount) => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: from,
      to: to,
      assetIndex: parseInt(assetIndex),
      amount: amount,
      suggestedParams
    });
    const peraWallet = new PeraWalletConnect();
    console.log(txn, "txn")
    const singleTxnGroups = [{ txn, signers: [from] }];
    const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
    console.log(signedTxn, "sign")
    return;
    await algodClient.sendRawTransaction(signedTxn).do();
    let txId = txn.txID().toString()
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
    console.log(
      `Transaction ${txId} confirmed in round ${confirmedTxn['confirmed-round']}\n`
    );
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }

  // async function generateAssetTransferTxns({
  //   to,
  //   assetID,
  //   initiatorAddr
  // }: {
  //   to: string;
  //   assetID: number;
  //   initiatorAddr: string;
  // }) {
  //   const suggestedParams = await algodClient.getTransactionParams().do();

  //   const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //     from: initiatorAddr,
  //     to,
  //     assetIndex: assetID,
  //     amount: 1,
  //     suggestedParams
  //   });

  //   return [{ txn, signers: [initiatorAddr] }];
  // }

  // const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
  // const txParams = await algodClient.getTransactionParams().do();
  // const note = undefined;
  // const peraWallet = new PeraWalletConnect();

  // const txn = {
  //   to: to,
  //   fee: 1000,
  //   flatFee: true,
  //   assetIndex: assetIndex,
  //   amount: parseInt(amount),
  //   type: 'axfer',
  //   note: note,
  //   from: await peraWallet.getAddress(),
  //   suggestedParams: {
  //     ...txParams,
  //     fee: 1000,
  //   },
  // };

  // try {
  //   const peraWallet = new PeraWalletConnect();
  //   await peraWallet.connect();

  //   const signedTxn = await peraWallet.signTransaction(txn);
  //   console.log('Signed transaction:', signedTxn);

  //   const sentTxn = await algodClient.sendRawTransaction(signedTxn.blob).do();
  //   console.log('Sent transaction:', sentTxn);

  //   // setSignedTxn(signedTxn);
  // } catch (error) {
  //   console.error('Transaction failed:', error);
  // }
}