# TradeChain - A Global Trading and Lending Platform

## Background
Globalization has connected the world enabling shipping of goods and services across countries.But capital movement across the borders is challenging and expensive with exorbitant remittance fees.Hence, investors are disincentivized to transfer capital across borders to make investments. There by limiting opportunities to investors.
Eg: To transfer funds from INR to USD average transfer rates are 3.5% of the fund transferred.

## Opportunity
Low-cost movement of capital across the world for investments.No single platform exists which combines capabilities of Low-Cost transfers and Analyses investment products.Reducing paperwork and bureaucracy for retail investors in developing/developed countries for capital movement and investments.Lending capital to investors locking their investments as collateral on global scale.
Eg: Personal loan interest rates in India avg at 15% and US avg at 7%.

## Solution
A platform which can enable transactions across the world in single currency (SOLs). There by enabling peer comparison of global financial products like Stocks, Bonds, Debentures and Derivatives.As the trading platform has high volume transactions, underlying cryptocurrency should be able to settle transactions quickly.Therefore, the solution is possible with a crypto platform as it has faster transaction settling times. Along with trading the platform can also offer loans to investors pledging their portfolio as collateral.

## What TradeChain does
  We have built a Trading Platform that enables to buy SOL in any currency (Eg: Indian investor in INR, US investor in USD etc.) directly from the platform using Rapyd Payment Gateway simulation. It also provides information (both fundamental and technical) on Global Financial products fetched using Alphavantage API and converts financial information fetched in different currencies into SOL denomination which makes it easier for investor's analysis. On top of this investors can also take loans on the platform pledging their portfolio as collateral.
  
   Every investor will have a Solana Wallet and a Currency Wallet created during Signup. Investor can add funds to Currency Wallet in any currency and buy SOLs which will get credited to Solana Wallet. Using SOLs investor can execute trades on Global Financial Products, a transaction processing fee is charged on every trade. Every investor can take up to 75% of the portfolio value as loan in SOLs and a daily interest is charged on this loan. Therefore, the platform has two main sources of monetisation.
1. Processing Fees
2. Interest Income

## How we built it
We have built application using 
1. _Solana-Web3.js_ - For Solana wallet creation and transactions
2. _Google Cloud Firebase_ - For user authentication and firestore for storing user details
3. _Alpha Vantage_ - To fetch stock information
4. _Node.js, Express.js_ - For building backend APIs
5. _React.js, Bootstrap, ApexCharts_ - UIX development

![image](https://user-images.githubusercontent.com/127075397/224971247-73165e41-66c7-45cd-9e97-c03152c860ab.png)

## Future Roadmap
1. Peer lending capabilities instead of only company lending to investors pledging their portfolio.
2. Include different investment opportunities like Startup Funding, Social Funding and Donating for a global cause.
3. Purchase premium Alphavantage subscription and enable live search & get latest traded price without delay.

-----------------------------
###Testing Instructions
_To run demo:_
1. Navigate to http://13.230.186.196:6950/
2. Use below login credentials to test TradeChain application right away

_Existing User Login:_
- Email : josephhenry@gmail.com 
- Password: Solana@12

_Admin Login:_
- Email : tradechain@gmail.com 
- Password: Solanaadmin@12

_To run source code:_
1. Install Node.js version 16 or higher
2. Download Source code from GitHub repo
3. Go to command line and navigate to source code
4. Navigate to backend folder and run below commands: 
    1. npm install 
    2. npx nodemon ./index.js 
    3. This will create express server backend in localhost:5000
5. Navigate to TradeChain folder and run below commands: 
    1. npm install
    2. npm run start 
    3. This will start front end application in localhost:3000

Search below Companies:
	
| Tickers | Company Name |
|--------| -------|
| TECHM.BSE| Tech Mahindra |
| INFY.BSE| Infosys |
| M&M.BSE| Mahindra & Mahindra |
| APOLLOTYRE.BSE| Apollo Tyres |
| ARVIND.BSE| Arvind Ltd |
| BHARTIARTL.BSE| Bharati Airtel |
| AXISBANK.BSE| Axis Bank |
| BPCL.BSE| Bharath Petroleum Corporation |
| DIVISLAB.BSE| Divi's Laboratories |
| DRREDDY.BSE| Dr. Reddy's Laboratories |
| MO| Altria Group, Inc. |
| AVB| AvalonBay Communities |
| BBY| Best Buy Co., Inc. |
| BK| BNY Mellon |
| CL| Colgate Palmolive Company |
| MMM| 3M Company |
| ANF| Abercrombie & Fitch Co. |
| ABT| Abbott Laboratories |
| ADBE| Adobe |
| ALK| Alaska Air Group |
| AAL| American Airlines Group Inc |
| AXP| American Express |
| WHR| Whirlpool Corporation |
| WDAY| Workday, Inc |
| VZ| Verizon Communications Inc. |
| VMW| VMware, Inc |
| X| United States Steel Corporation |
| DIS| The Walt Disney Company |
| TDC| Teradata Corp. |
