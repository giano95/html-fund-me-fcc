// Friendly reminder:
// BackEnd  --> require()
// FrontEnd --> import
import { ethers } from "./lib/ethers-5.6.esm.min.js"

// Grabbing the buttons from html
const connectButton = document.querySelector(".connectButton")
const fundButton = document.querySelector(".fundButton")
// Assign to the buttons our js function
connectButton.onclick = connect
fundButton.onclick = fund

console.log(ethers)

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
async function fund() {}

// Withdraw
