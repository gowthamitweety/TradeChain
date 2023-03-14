import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useSolana } from "../../context/SolanaContext";
import Swal from "sweetalert2";
import { useFirestore } from "../../context/FirestoreContext";

const RepayLoan = ({ user, loan }) => {
  const { userToCompanySOLTransfer } = useSolana();
  const { addDocument } = useFirestore();
  const [amount, setAmount] = useState();
  const [existingLoan, setExistingLoan] = useState();

  useEffect(() => {
    setExistingLoan(loan);
  }, []);
  const handleConfirm = () => {
    if (parseFloat(amount) > parseFloat(loan)) {
      Swal.fire({
        title: "Please enter amount less than existing loan!",
        icon: "error",
      });
    } else {
      let date = new Date();
      Swal.fire({
        title: "processing transaction..please wait",
      });
      Swal.showLoading();
      userToCompanySOLTransfer(
        user.SolanaAcc.wallet_address,
        user.SolanaAcc.wallet_privatekey,
        amount
      ).then((y) => {
        let loanRepayDoc = {
          Email: user.Email,
          Amount: -1 * parseFloat(amount),
          Currency: "SOL",
          Type: "Repaid",
          TransactionDate: date.getTime(),
          // TransactionDate: `${
          //   date.getMonth() + 1
          // }-${date.getDate()}-${date.getFullYear()}`,
        };
        addDocument(loanRepayDoc, "UserLoanTransactions").then((res) => {
          Swal.close();
          Swal.fire({
            title: "Transferred successfully!",
            html: `Tx signature:${y}`,
            icon: "success",
          });
        });
      });
    }
  };

  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Group className="mb-3">
            <Form.Label>Existing Loan = {existingLoan} SOL</Form.Label>
          </Form.Group>
        </Col>
        {parseFloat(existingLoan) > 0 ? (
          <>
            <Col xs={8}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Enter SOL to repay loan:
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
          "No loan history available!"
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

export default RepayLoan;
