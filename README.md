## Usage
    var bitstamp = require('bitstampjs');

For each currency pair create a bitstamp object:

    constructor(apiKey, secret, customerId, currencyPair)
* **apiKey**, **secret** and **customerId** are retried from your bitstamp accoubnt: https://www.bitstamp.net/api/

* Supported **currencyPairs**: btcusd, btceur, eurusd, xrpusd, xrpeur, xrpbtc, ltcusd, ltceur, ltcbtc, ethusd, etheur, ethbtc


## Supported methods:
Note: cb return (error, result). You can use bitstamp.printError(error) to pretty print the errors.
All parameters and responses are as described in [bitstamp api official documentation] (https://www.bitstamp.net/api/)

* **getUserTransactions(cb)**

* **getUserBalance(cb)**

* **getOpenOrders(cb)**

* **getOrderStatus(id, cb)**

* **cancelOrder(id, cb)**

* **cancelAllOrders(cb)**

* **buyLimitOrder(amount, price, cb)**

* **sellLimitOrder(amount, price, cb)**

* **buyMarketOrder(amount, cb)**

* **sellMarketOrder(amount, cb)**

* **transferFromSubToMain(amount, currency, subAccount, cb)**

* **transferFromMainToSub(amount, currency, subAccount, cb)**

* **bankWithdrawalStatus(id, cb)**

* **cancelBankWithdrawal(id, cb)**

* **openBankWithdrawal(cb)**


* **getWithdrawals(cb)**

* **bitcoinWithdrawal(amount, address, instant, cb)**

* **getBitcoinDepositAddress(cb)**

* **getUnconfirmedBicoinDeposits(cb)**

* **rippleWithdrawal(amount, address, currency, cb)**

* **getRippleDepositAddress(cb)**

* **litecoinWithdrawal(amount, address, cb)**

* **getLitecoinDepositAddresses(cb)**

* **ethWithdrawal(amount, address, cb)**

* **getEthDepositAddresses(cb)**

* **xrpWithdrawal(amount, address, destinationTag, cb)**

* **getXrpDepositAddresses(cb)**


* **addLiquidationAddress(liquidationCurrency, cb)**

* **getLiquidationAddressInfo(address = null, cb)**

* **printError(error, printer)**


## Exposed constants:

#### Bitstamp.TRANSACTIONS:
This is what bitstamp api returns for transaction type

 * DEPOSIT: 0
 * WITHDRAWAL: 1
 * TRADE: 2
 * TRANSFER: 14


#### Bitstamp.TRANSACTIONS:
This is what bitstamp api returns for order type

 * BUY: 0
 * SELL: 1



### Example

    let bitstampBTC = new Bitstamp(API_KEY, SECRET, CUSTOMER_ID, 'btceur');
    let bitstampETH = new Bitstamp(API_KEY, SECRET, CUSTOMER_ID, 'btceur');


    // gets bitcoin's transactions
    bitstampBTC.getUserTransactions((err, rawData) => {
      if (err) {
        return bitstamp.printError(err, logger.error);
      }
      
      console.log(rawData);
    });

    // get eth transactions
    bitstampETH.getUserTransactions((err, rawData) => {
      if (err) {
        return bitstamp.printError(err, logger.error);
      }
      
      console.log(rawData);
    });
