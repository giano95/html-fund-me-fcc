// Friendly reminder:
// BackEnd  --> require()
// FrontEnd --> import
import { ethers } from "./lib/ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./costants.js"

// Grabbing the buttons from html
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const contractBalance = document.getElementById("contractBalance")
const withdrawButton = document.getElementById("withdrawButton")
const ethAmount = document.getElementById("ethAmount")

// Assign to the buttons our js function
connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw

// Get contract balance
contractBalance.innerHTML = await getBalance()

// And then update it every 3 sec
setInterval(async () => {
    contractBalance.innerHTML = await getBalance()
}, 3 * 1000)

// Connect to Metamask wallet
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

// Fund me
async function fund() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        console.log(contract)
        try {
            // Extract the ETH amount from the HTML page
            const sendValue = ethers.utils.parseEther(ethAmount.value)
            console.log(`Funding with ${ethAmount.value} ETH...`)
            // Send the transaction
            const txResponse = await contract.fund({
                value: sendValue,
            })
            // Wait for the transaction to be mined
            await listenForTransactionToBeMined(txResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

// Get balance
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            let balance = await provider.getBalance(contractAddress)
            balance = ethers.utils.formatEther(balance)
            console.log(balance)
            return balance
        } catch (error) {
            console.log(error)
            return "Error"
        }
    } else {
        return "[ Please install MetaMask ]"
    }
}

// Withdraw
async function withdraw() {
    console.log("Withdrawing")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        console.log(contract)
        try {
            const txResponse = await contract.withdraw()
            await listenForTransactionToBeMined(txResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

// Used to wait for Transaction to be completed/mined
function listenForTransactionToBeMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    // We return a Promise, a promise go back only when resolve() or reject()
    // is called, so in this case only when the `hash` event trigger
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations. `
            )
            resolve()
        })
    })
}
