import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useUserAuth } from "../context/UserAuthContext";
import { useSolana } from "../context/SolanaContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useFirestore } from "../context/FirestoreContext";
import { NavDropdown, Badge, Button } from "react-bootstrap";

const NavbarLayout = ({
  user,
  setUser,
  setPortfolio,
  solBalance,
  setSolBalance,
  loan,
  setLoan,
}) => {
  const navigate = useNavigate();
  const { getDocument, getDocuments } = useFirestore();
  const { getSolanaWalletBalance } = useSolana();

  const handleLogout = async () => {
    try {
      await logOut();
      setSolBalance("0");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const { logOut, userLogged } = useUserAuth();
  const linkStyle = {
    color: "#ffffff8c",
    textDecoration: "none",
  };
  const ddStyle = {
    color: "black",
    textDecoration: "none",
  };
  useEffect(() => {
    if (userLogged === null || userLogged === undefined) {
    } else {
      if (Object.keys(userLogged).length > 0) {
        if (Object.keys(user).includes("Email") === false) {
          getDocument(userLogged.email, "Users", "Email").then((x) => {
            console.log("document", x.data());
            getSolanaWalletBalance(x.data().SolanaAcc.wallet_address).then(
              (bal) => {
                setSolBalance(parseFloat(bal.replace('"', "")).toFixed(2));
                console.log("solBalance", x.data());
                setUser(x.data());
              }
            );
          });
          if (userLogged.email == "tradechain@gmail.com") {
            getDocuments("", "UserPortfolio", "CO2E").then((x) => {
              x.length > 0 && setPortfolio(x);
            });
          } else {
            getDocuments(userLogged.email, "UserPortfolio", "Email").then(
              (x) => {
                x.length > 0 && setPortfolio(x);
              }
            );
          }

          if (userLogged.email == "tradechain@gmail.com") {
            getDocuments("SOL", "UserLoanTransactions", "Currency").then(
              (x) => {
                x.length > 0 && setLoan(x);
              }
            );
          } else {
            getDocuments(
              userLogged.email,
              "UserLoanTransactions",
              "Email"
            ).then((x) => {
              x.length > 0 && setLoan(x);
            });
          }
        }
      }
    }
  });
  return (
    <>
      <Navbar
        className="navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#67768a" }}
      >
        <Container>
          <Navbar.Brand>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <img
                src="logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              TradeChain
            </Link>
          </Navbar.Brand>
          <Nav>
            {userLogged === null || Object.keys(userLogged).length === 0 ? (
              <>
                <Nav.Link>
                  <Link to="/signup" style={linkStyle}>
                    SignUp
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/" style={linkStyle}>
                    Login
                  </Link>
                </Nav.Link>
              </>
            ) : (
              <>
                <Button
                  className="badge position-relative btn-outline-light"
                  variant="warning"
                  onClick={() => {
                    window.location.href = "/mywallet";
                  }}
                >
                  SOL Balance : {solBalance}
                </Button>
                <NavDropdown
                  title={
                    user.FirstName + " " + user.LastName === "John Doe"
                      ? "Admin"
                      : user.FirstName + " " + user.LastName
                  }
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item>
                    {user.Email === "tradechain@gmail.com" ? (
                      <Link to="/mywallet" style={ddStyle}>
                        Company Wallet
                      </Link>
                    ) : (
                      <Link to="/mywallet" style={ddStyle}>
                        Wallet
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {user.Email === "tradechain@gmail.com" && (
                      <Link to="/companyearnings" style={ddStyle}>
                        Company Earnings
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {user.Email !== "tradechain@gmail.com" && (
                      <Link to="/myportfolio" style={ddStyle}>
                        Portfolio
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="" style={ddStyle} onClick={handleLogout}>
                      Logout
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarLayout;
