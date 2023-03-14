import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
//import "bootstrap/dist/css/bootstrap.min.css";
import NavbarLayout from "./components/Navbar";
import { FirestoreContextProvider } from "./context/FirestoreContext";
import { RapydContextProvider } from "./context/RapydContext";
import Portfolio from "./components/portfolio/Portfolio";
import { useState } from "react";
import MyWallet from "./components/wallet/MyWallet";
import { SolanaContextProvider } from "./context/SolanaContext";
import Earnings from "./components/wallet/Earnings";

function App() {
  const [user, setUser] = useState({
    RapydAcc: { ewallet_id: "" },
    SolanaAcc: { wallet_address: "", wallet_privatekey: "" },
  });
  const [portfolio, setPortfolio] = useState([]);
  const [solBalance, setSolBalance] = useState("0");
  const [loan, setLoan] = useState([]);
  return (
    <UserAuthContextProvider>
      <FirestoreContextProvider>
        <RapydContextProvider>
          <SolanaContextProvider>
            <NavbarLayout
              user={user}
              setUser={setUser}
              setPortfolio={setPortfolio}
              solBalance={solBalance}
              setSolBalance={setSolBalance}
              loan={loan}
              setLoan={setLoan}
            />
            <Container fluid>
              <Routes>
                <Route
                  path="/mywallet"
                  element={
                    <ProtectedRoute>
                      <MyWallet
                        user={user}
                        solBalance={solBalance}
                        setSolBalance={setSolBalance}
                        portfolio={portfolio}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companywallet"
                  element={
                    <ProtectedRoute>
                      <MyWallet
                        user={user}
                        setUser={setUser}
                        solBalance={solBalance}
                        setSolBalance={setSolBalance}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companyearnings"
                  element={
                    <ProtectedRoute>
                      <Earnings
                        user={user}
                        setUser={setUser}
                        loan={loan}
                        portfolio={portfolio}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Login
                      user={user}
                      setUser={setUser}
                      portfolio={portfolio}
                      setPortfolio={setPortfolio}
                      setSolBalance={setSolBalance}
                    />
                  }
                />
                <Route
                  path="/signup"
                  element={<Signup user={user} setUser={setUser} />}
                />
                <Route
                  path="/myportfolio"
                  element={
                    <ProtectedRoute>
                      <Portfolio
                        user={user}
                        portfolio={portfolio}
                        setPortfolio={setPortfolio}
                        solBalance={solBalance}
                        setSolBalance={setSolBalance}
                        loan={loan}
                        setLoan={setLoan}
                      />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Container>
          </SolanaContextProvider>
        </RapydContextProvider>
      </FirestoreContextProvider>
    </UserAuthContextProvider>
  );
}

export default App;
