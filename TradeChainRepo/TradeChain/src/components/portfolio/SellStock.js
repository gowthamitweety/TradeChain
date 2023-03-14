import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import { getGlobalQuote } from "../Lib/StocksApi";
import { useRapyd } from "../../context/RapydContext";
import { useSolana } from "../../context/SolanaContext";
import { useFirestore } from "../../context/FirestoreContext";
import Swal from "sweetalert2";

const SellStock = ({
  stock,
  user,
  portfolio,
  setPortfolio,
  solBalance,
  setSolBalance,
  loanAmount,
  portfolioVal,
}) => {
  const [error, setError] = useState("");
  const [lots, setLots] = useState(0);
  const [globalQuote, setGlobalQuote] = useState({});
  const { getWalletBalance, walletTransfer } = useRapyd();
  const { getSolanaPrice, companyToUserSOLTransfer, getSolanaWalletBalance } =
    useSolana();
  const [balance, setBalance] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const { addDocument, getDocuments } = useFirestore();
  const [totalStocks, setTotalStocks] = useState(0);
  const [solStockPrice, setSolStockPrice] = useState();

  useEffect(() => {
    setBalance(solBalance);
    getTotalStocksOfCompany(portfolio, stock["AlphaTicker"]);
    getGlobalQuote(stock["AlphaTicker"])
      .then((resp) => resp.json())
      .then((item) => {
        setGlobalQuote(item["Global Quote"]);
        getSolanaPrice(stock["Currency"], "SOL").then((res) => {
          let price =
            parseFloat(res.rate.toFixed(5)) *
            parseFloat(item["Global Quote"]["05. price"]);
          setSolStockPrice(price.toFixed(2));
        });
      });
  }, []);
  const fetchAmount = (e) => {
    setLots(e.target.value);
    const lots = e.target.value;
    const amount = parseInt(lots) * parseFloat(solStockPrice);
    setTotalAmount(parseFloat(amount.toFixed(2)));
  };
  const getTotalStocksOfCompany = (data, symbol) => {
    let total = 0;
    data
      .filter((x) => x.Symbol === symbol)
      .forEach((x) => {
        total += parseInt(x.Quantity);
      });
    setTotalStocks(total);
  };
  const executeOrder = () => {
    let date = new Date();
    if (parseInt(totalStocks) < parseInt(lots)) {
      Swal.fire({
        icon: "error",
        title: "Buy more to sell more!",
      });
    } else if (
      parseFloat(portfolioVal) - parseFloat(totalAmount) <
      1.33 * parseFloat(loanAmount)
    ) {
      Swal.fire({
        icon: "error",
        title:
          "You cannot sell stocks as total loan amount exceeds the portfolio collateral!",
      });
    } else {
      Swal.fire({
        title: "processing order..please wait",
      });
      Swal.showLoading();
      let doc = {
        Email: user.Email,
        Symbol: stock["AlphaTicker"],
        CompanyName: stock["Company Name"],
        Price: solStockPrice,
        Quantity: -1 * parseInt(lots),
        ProcessingFee: 0.01 * parseFloat(solStockPrice) * parseInt(lots),
        Currency: stock["Currency"],
        Type: "Sell",
        CO2E: "",
        TransactionDate: `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`,
      };

      companyToUserSOLTransfer(user.SolanaAcc.wallet_address, totalAmount).then(
        (x) => {
          addDocument(doc, "UserPortfolio").then((res) => {
            getDocuments(user.Email, "UserPortfolio", "Email").then((res) => {
              setPortfolio(res);
              getSolanaWalletBalance(user.SolanaAcc.wallet_address).then(
                (bal) => {
                  setSolBalance(parseFloat(bal.replace('"', "")).toFixed(2));
                  Swal.close();
                  Swal.fire({
                    title: "Sold successfully!",
                    html: `Tx signature: ${x}`,
                    icon: "success",
                  });
                }
              );
            });
          });
        }
      );
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col xs={9}></Col>
        <Col xs={3}>
          <b>Available balance : </b>
          {balance} SOL
        </Col>
      </Row>
      <Row>
        <Col xs={9}></Col>
        <Col xs={3}>
          <b>Available Units : </b>
          {totalStocks}
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="formBasicLots">
            <Form.Label>Lots</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter no.of stocks to sell"
              name="Lots"
              onChange={fetchAmount}
              value={lots}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicPrice">
            <Form.Label>Stock Price</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Close Price"
              name=""
              value={solStockPrice}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={9}></Col>
        <Col xs={3}>
          <Form.Group className="mb-3" controlId="formBasicLots">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Total amount"
              value={totalAmount}
            />
          </Form.Group>
        </Col>
      </Row>
      <div class="d-flex align-items-end" style={{ height: "6vh" }}>
        <Button className="ms-auto" variant="primary" onClick={executeOrder}>
          Execute order
        </Button>
      </div>
    </>
  );
};

export default SellStock;
