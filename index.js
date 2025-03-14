require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const ethers = require("ethers");

// Middleware setup
app.use(
  fileUpload({
    extended: true,
  })
);
app.use(express.static(__dirname)); // Fixed typo: _dirname -> __dirname
app.use(express.json());

// Server port
const port = 7545;

// Environment variables
const API_URL = process.env.API_URL; // Fixed typo: API - URL -> API_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Fixed typo: CONTRACT_ADDESS -> CONTRACT_ADDRESS

// Load contract ABI
const { abi } = require("./artifacts/contracts/voting.sol/Voting.json");

// Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = ethers.Wallet.fromMnemonic(
  process.env.MNEMONIC,
  "m/44'/60'/0'/0/0"
);
const signer = wallet.connect(provider);

// Initialize contract instance
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

app.post("/addCandidate", async (req, res) => {
  var vote = req.body.vote;
  console.log(vote);
  async function storeDataInBlockchain(vote) {
    console.log("Adding the candidate in voting contract...");
    const tx = await contractInstance.addCandidate(vote);
    await tx.wait();
  }
  const bool = await contractInstance.getVotingStatus();
  if (bool == true) {
    await storeDataInBlockchain(vote);
    res.send("The Candidate has been registered in the smart contract");
  } else {
    res.send("Voting is finished");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
