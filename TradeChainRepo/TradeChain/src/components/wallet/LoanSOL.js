import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useSolana } from "../../context/SolanaContext";
import Swal from "sweetalert2";
import { useFirestore } from "../../context/FirestoreContext";

const LoanSOL = ({ user, portfolio, loan }) => {
  const { companyToUserSOLTransfer } = useSolana();
  const { addDocument } = useFirestore();
  const [amount, setAmount] = useState();
  const [eligibleLoan, setEligibleLoan] = useState();
  const [portfolioSOL, setPortfolioSOL] = useState();

  const groupPortfolio = (data) => {
    var result = [];
    data.reduce((res, val) => {
      if (!res[val.Symbol]) {
        //const closePrice = await getLatestPrice(val.Symbol);
        res[val.Symbol] = {
          Symbol: val.Symbol,
          CompanyName: val.CompanyName,
          Currency: val.Currency,
          Quantity: val.Quantity,
          TotalCost: val.Quantity * parseFloat(val.Price),
          Gains: 0,
        };
        result.push(res[val.Symbol]);
      } else {
        res[val.Symbol].Quantity += val.Quantity;
        res[val.Symbol].TotalCost +=
          parseInt(val.Quantity) * parseFloat(val.Price);
      }
      return res;
    }, {});
    return result;
  };
  const getPortfolioValue = () => {
    debugger;
    const grpData = groupPortfolio(portfolio);
    let totalValue = 0;
    for (let data of grpData) {
      totalValue += data.TotalCost;
    }
    setPortfolioSOL(totalValue.toFixed(2));
    setEligibleLoan((0.75 * totalValue - parseFloat(loan)).toFixed(2));
  };
  useEffect(() => {
    getPortfolioValue();
  }, []);
  const handleConfirm = () => {
    if (parseFloat(amount) > parseFloat(eligibleLoan)) {
      Swal.fire({
        title: "Please enter amount less than eligible loan!",
        icon: "error",
      });
    } else {
      let date = new Date();
      Swal.fire({
        title: "processing transaction..please wait",
      });
      Swal.showLoading();
      companyToUserSOLTransfer(user.SolanaAcc.wallet_address, amount).then(
        (y) => {
          let loanDoc = {
            Email: user.Email,
            Amount: amount,
            Currency: "SOL",
            Type: "Disbursed",
            TransactionDate: date.getTime(),
            // TransactionDate: `${
            //   date.getMonth() + 1
            // }-${date.getDate()}-${date.getFullYear()}`,
          };
          addDocument(loanDoc, "UserLoanTransactions").then((res) => {
            Swal.close();
            Swal.fire({
              title: "Transferred successfully!",
              html: `Tx Signature: ${y}`,
              icon: "success",
            });
          });
        }
      );
    }
  };

  return (
    <>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>Portfolio Value = {portfolioSOL} SOL</Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {parseFloat(portfolioSOL) > 0 ? (
          <>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amount eligible as loan:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="eligibleLoan"
                  name="eligibleLoan"
                  value={eligibleLoan}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Enter SOL to take as loan:
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount in SOL"
                  name="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
              </Form.Group>
            </Col>
          </>
        ) : (
          "Sorry we cannot provide loan as net worth of Portfolio is either zero or less than existing loan!"
        )}
      </Row>
      <Row>
        <Col className="d-flex align-items-end">
          <Button className="ms-auto" variant="warning" onClick={handleConfirm}>
            Confirm
          </Button>
          {/* </div> */}
        </Col>
      </Row>
    </>
  );
};

export default LoanSOL;
