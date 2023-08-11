import {installNautilus, noti_option_close, txSubmmited} from "@/components/Notifications/Toast";
import {Id, toast} from "react-toastify";
import {isMainnet} from "@/blockchain/ergo/constants";
import {SignedTransaction} from "@nautilus-js/eip12-types";


export const getWalletConnection = async () => {
    if ((window as any).ergoConnector) {
        if ((window as any).ergoConnector.nautilus) {
            // check if Nautilus Wallet is available
            return await (window as any).ergoConnector.nautilus.connect();
        } else {
            return false;
        }
    }
    toast.warn('Click me to install Nautilus Ergo Wallet', installNautilus);
    return false;
};

export const getWalletConn = async () => {
    const walletConnection = await getWalletConnection();

    if (!walletConnection) {
        toast.dismiss();
        toast.warn('please connect wallet', noti_option_close('try-again'));
        return false;
    }
    return true;
};

export const signAndSubmitTx = async (unsignedTransaction: any, ergo: any, txBuilding_noti: Id) => {
    let signedTransaction: SignedTransaction;

    try {
        signedTransaction = await ergo!.sign_tx(unsignedTransaction);

        toast.update(txBuilding_noti, {
            render: 'Sign your transaction',
            type: 'success',
            isLoading: false,
            autoClose: false,
        });
    } catch (error) {
        console.log(error);
        //@ts-ignore
        if ('code' in error) {
            toast.dismiss();
            toast.warn('canceled by user', noti_option_close('try-again'));
            return;
        }
        throw error;
    }

    const hash = await ergo!.submit_tx(signedTransaction);
    console.log('tx hash:', hash);
    toast.dismiss();
    txSubmmited(hash, isMainnet);
};