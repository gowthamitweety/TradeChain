import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useRapyd } from "../../context/RapydContext";
import { useSolana } from "../../context/SolanaContext";
import Swal from "sweetalert2";
import { createPath } from "react-router-dom";

const BuySOL = ({ user, currency, balance }) => {
  const {
    getSolanaPrice,
    companyToUserSOLTransfer,
    depouserToCompanySOLTransfersit,
  } = useSolana();
  const { walletTransfer } = useRapyd();
  const [amount, setAmount] = useState();
  const [fxRate, setFxRate] = useState("");
  const [dedAmount, setDedAmount] = useState();
  const onAmountChange = (e) => {
    setAmount(e.target.value);
    console.log(e.target.value);
    let deductedAmount = parseFloat(e.target.value) * parseFloat(fxRate);
    console.log(deductedAmount);
    setDedAmount(parseFloat(deductedAmount.toFixed(3)));
  };
  useEffect(() => {
    getSolanaPrice("SOL", currency).then((res) => {
      setFxRate(res.rate.toFixed(5));
    });
  }, []);
  const handleConfirm = () => {
    if (parseFloat(balance) < dedAmount) {
      console.log("balance", balance);
      Swal.fire({
        title: "Amount exceeds existing currency wallet balance!",
        html: ``,
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "processing transaction..please wait",
      });
      Swal.showLoading();
      companyToUserSOLTransfer(user.SolanaAcc.wallet_address, amount).then(
        (y) => {
          console.log(dedAmount);
          walletTransfer(
            user.RapydAcc.ewallet_id,
            Math.ceil(dedAmount),
            currency,
            "buy"
          ).then((x) => {
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
            <Form.Label>
              1 SOL = {fxRate} {currency}
            </Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Enter SOL to buy:
              <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              onChange={onAmountChange}
              value={amount}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>Amount to be deducted in {currency}:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Deducted Amount"
              name="dedAmount"
              disabled
              value={dedAmount}
            />
          </Form.Group>
        </Col>
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

export default BuySOL;
