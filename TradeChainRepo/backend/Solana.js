const express = require("express");
const router = express.Router();
const web3 = require("@solana/web3.js");
const bs58 = require("bs58");
const https = require("https");
const { default: Web3 } = require("web3");
const log = false;

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

//Create Solana wallet for user
router.get("/createSolanaWallet", async (req, res) => {
  try {
    let keypair = web3.Keypair.generate();
    let publicKey = keypair.publicKey.toBase58();
    let secretKey = bs58.encode(keypair.secretKey);
    return res.status(200).json({ publicKey, secretKey });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json(error);
  }
});

//Get Solana wallet balance
router.get("/getSolanaWalletBalance", async (req, res) => {
  try {
    let bs58PublicKey = req.query.bs58PublicKey;
    let publicKey = new web3.PublicKey(bs58PublicKey);
    let balance = await connection.getBalance(publicKey);
    return res.status(200).json(balance / web3.LAMPORTS_PER_SOL);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

// SOL wallet transfer from source to destination
router.get("/walletSOLTransfer", async (req, res) => {
  try {
    let sourceKey = req.query.sourcePubKey;
    let sourcePublicKey = new web3.PublicKey(sourceKey);
    let destKey = req.query.destPubKey;
    let destPublicKey = new web3.PublicKey(destKey);
    let secretKey = req.query.sourceSecKey;
    let amount = req.query.amount;
    const srcKeypair = web3.Keypair.fromSecretKey(bs58.decode(secretKey));

    let transaction = new web3.Transaction();
    transaction.add(
      web3.SystemProgram.transfer({
        fromPubkey: sourcePublicKey,
        toPubkey: destPublicKey,
        lamports: amount * web3.LAMPORTS_PER_SOL,
      })
    );
    let tx = await web3.sendAndConfirmTransaction(connection, transaction, [
      srcKeypair,
    ]);
    return res.status(200).json(tx);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

//get exchange rate of SOL vs any base currency(USD, INR..) using CoinAPI
router.get("/getSOLPrice", async (req, res) => {
  try {
    const base_currency = req.query.baseCurrency;
    const dest_currency = req.query.destCurrency;
    var options = {
      method: "GET",
      hostname: "rest.coinapi.io",
      path: `/v1/exchangerate/${base_currency}/${dest_currency}`,
      headers: { "X-CoinAPI-Key": "82F78055-6292-46F7-9EB7-846612D9F145" },
    };
    var response = await httpRequest(options, null, log);
    return res.status(200).json(response.body);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//get Solana wallet Transactions
router.get("/listSolanaWalletTransactions", async (req, res) => {
  try {
    let sourceKey = req.query.sourcePubKey;
    let sourcePublicKey = new web3.PublicKey(sourceKey);
    let transactionList = await connection.getSignaturesForAddress(
      sourcePublicKey,
      { limit: 50 }
    );
    let signatureList = transactionList.map(
      (transaction) => transaction.signature
    );
    let transactionDetails = await connection.getParsedTransactions(
      signatureList,
      { maxSupportedTransactionVersion: 0 }
    );
    let transactions = [];
    transactionList.forEach((transaction, i) => {
      const date = new Date(transaction.blockTime * 1000);
      const transactionInstructions =
        transactionDetails[i].transaction.message.instructions;
      let objTx = {
        Signature: transaction.signature,
        TxDate: date,
        Status: transaction.confirmationStatus,
        Source: transactionInstructions[0].parsed.info.source,
        Destination: transactionInstructions[0].parsed.info.destination,
        Amount:
          transactionInstructions[0].parsed.info.lamports /
          web3.LAMPORTS_PER_SOL,
        Type: transactionInstructions[0].parsed.type,
      };
      transactions.push(objTx);
    });
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//Utility function to make http request
async function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyString = "";
      if (body) {
        bodyString = JSON.stringify(body);
        bodyString = bodyString == "{}" ? "" : bodyString;
      }

      log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
      const req = https.request(options, (res) => {
        let response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: "",
        };

        res.on("data", (data) => {
          response.body += data;
        });

        res.on("end", () => {
          console.log(response.body);
          response.body = response.body ? JSON.parse(response.body) : {};
          log &&
            console.log(`httpRequest response: ${JSON.stringify(response)}`);

          if (response.statusCode !== 200) {
            return reject(response);
          }

          return resolve(response);
        });
      });

      req.on("error", (error) => {
        return reject(error);
      });

      req.write(bodyString);
      req.end();
    } catch (err) {
      return reject(err);
    }
  });
}
module.exports = router;
