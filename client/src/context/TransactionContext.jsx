import React, { useEffect, useState} from "react";
import {ethers} from "ethers";

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) => {
const [currentAccount, setCurrentAccount] = useState(null); 
const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
const [isLoading, setIsLoading] = useState(false);
const [transactionCount,setTransactionCount] = useState(localStorage.getItem('transactionCount'));

const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState,[name]: e.target.value}));
}

const checkIfWalletIsConnected = async () => {
    try {
        if(!ethereum) return alert("Please install metamask");

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(accounts.length){
        setCurrentAccount(accounts[0]);
    } else {
        console.log('No accounts found');
    }
    } catch (error) {
        console.log(error);
        throw new Error("No Ethereum object");
    }
    
    
}

const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        alert("Please install MetaMask!");
        return;
    }
    try {
        if(!ethereum) return alert("Please install metamask");
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

        setCurrentAccount(accounts[0]);

    } catch (error) {
        console.log(error);
        throw new Error("No Ethereum object");
    }
}

const sendTransaction = async () => {
    try {
        if (!ethereum) return alert("Please install MetaMask!");

        const { addressTo, amount, keyword, message } = formData;
        const transactionContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount).toHexString();

        // Send transaction using Ethereum
        await ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 Gwei
                    value: parsedAmount, // Amount in wei
                },
            ],
        });

        // Call the contract function
        const transactionResponse = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionResponse.hash}`); // Log the hash
        await transactionResponse.wait(); // Wait for the transaction to be mined
        setIsLoading(false);
        console.log(`Success - ${transactionResponse.hash}`);

        const transactionCount = await transactionContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
        localStorage.setItem("transactionCount", transactionCount.toNumber());
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw new Error("No Ethereum object");
    }
};


    useEffect(() => {
        checkIfWalletIsConnected();
    },[]);

    return (
        <TransactionContext.Provider value={{ connectWallet,currentAccount,formData,setFormData,handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}