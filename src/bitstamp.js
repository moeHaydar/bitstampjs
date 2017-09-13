'use strict'
const axios = require("axios");
const crypto = require('crypto');
const qs = require('qs');
const _ = require('lodash');

class Bitstamp {
   constructor(apiKey, secret, customerId, currencyPair){
    this.apiKey = apiKey;
    this.secret = secret;
    this.customerId = customerId;
    this.currencyPair = currencyPair;

    this.apiV2 = axios.create({
      baseURL: 'https://www.bitstamp.net/api/v2/',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });

    this.api = axios.create({
      baseURL: 'https://www.bitstamp.net/api/',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  }

  // Public apis
  getTicker(cb) {
    this.apiV2.get('ticker/' + this.currencyPair + '/')
      .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
   }


   getHourlyTicker(cb) {
    this.apiV2.get('ticker_hour/' + this.currencyPair + '/')
      .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
   }

   getHourlyTicker(cb) {
    this.apiV2.get('order_book/' + this.currencyPair + '/')
      .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
   }

  // private apis
  generateSignature(nonce) {
    const hash = crypto.createHmac('sha256', this.secret)
      .update(nonce + this.customerId + this.apiKey)
      .digest('hex');

    return hash.toUpperCase();
   }

   getNonce() {
    var now = new Date;

    return Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
   }


   getUserTransactions(cb, aggregated = []) {
    const LIMIT = 1000;
    let nonce = this.getNonce();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      limit: LIMIT,
      offset: aggregated.length,
      sort: 'asc'
    };
    this.apiV2.post('user_transactions/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      aggregated = _.concat(aggregated, response.data);
      if (response.data.length === LIMIT) {
        this.getUserTransactions(cb, aggregated);
      } else {
        cb(null, aggregated)
      }
    })
    .catch(cb);
  }

  getUserBalance(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.apiV2.post('balance/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getOpenOrders(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
    };
    this.apiV2.post('open_orders/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getOrderStatus(id, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      id: id
    };
    this.apiV2.post('order_status/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  cancelOrder(id, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      id: id
    };
    this.apiV2.post('cancel_order/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  cancelAllOrders(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.apiV2.post('cancel_all_orders/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  buyLimitOrder(amount, price, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      price: price
    };
    this.apiV2.post('buy/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  sellLimitOrder(amount, price, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      price: price
    };
    this.apiV2.post('sell/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  buyMarketOrder(amount, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount
    };
    this.apiV2.post('buy/market/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  sellMarketOrder(amount, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount
    };
    this.apiV2.post('sell/market/' + this.currencyPair + '/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getWithdrawals(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.api.post('withdrawal_requests/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  bitcoinWithdrawal(amount, address, instant, cb) {
    instant = (instant === 1 || instant === true); 
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      instant: instant,
      amount: amount,
      address: address
    };
    this.api.post('bitcoin_withdrawal/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getBitcoinDepositAddress(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.api.post('bitcoin_deposit_address/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getUnconfirmedBicoinDeposits(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.api.post('unconfirmed_btc/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  rippleWithdrawal(amount, address, currency, instant, cb) {
    instant = (instant === 1 || instant === true); 
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      instant: instant,
      amount: amount,
      address: address,
      currency: currency
    };
    this.api.post('ripple_withdrawal/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getRippleDepositAddress(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.api.post('ripple_address/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  litecoinWithdrawal(amount, address, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      address: address
    };
    this.apiV2.post('ltc_withdrawal/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getLitecoinDepositAddresses(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.apiV2.post('ltc_address/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  ethWithdrawal(amount, address, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      address: address
    };
    this.apiV2.post('eth_withdrawal/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getEthDepositAddresses(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.apiV2.post('eth_address/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  xrpWithdrawal(amount, address, destinationTag, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      address: address
    };
    if (destinationTag !== null && destinationTag !== undefined && destinationTag !== '') {
      params.destination_tag = destinationTag
    }
    this.apiV2.post('eth_withdrawal/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getXrpDepositAddresses(cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    this.apiV2.post('xrp_address/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  transferFromSubToMain(amount, currency, subAccount, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      currency: currency,
      subAccount: subAccount
    };
    this.apiV2.post('transfer-to-main/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  transferFromMainToSub(amount, currency, subAccount, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      amount: amount,
      currency: currency,
      subAccount: subAccount
    };
    this.apiV2.post('transfer-from-main/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  bankWithdrawalStatus(id, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      id: id
    };
    this.apiV2.post('withdrawal/status/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  cancelBankWithdrawal(id, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      id: id
    };
    this.apiV2.post('withdrawal/cancel/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  openBankWithdrawal(cb) {
    return cb('Not yet implemented. Cotact us on github');
  }

  addLiquidationAddress(liquidationCurrency, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce,
      liquidation_currency: liquidationCurrency
    };
    this.apiV2.post('liquidation_address/new/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  getLiquidationAddressInfo(address = null, cb) {
    let nonce = new Date().getTime();
    let params = {
      key: this.apiKey,
      signature: this.generateSignature(nonce),
      nonce: nonce
    };
    if (address !== null && address !== undefined && address !== '') {
      params.address = address;
    }
    this.apiV2.post('liquidation_address/new/', qs.stringify(params))
    .then(response => {
      cb(null, response.data)
    })
    .catch(cb);
  }

  printError(error, printer) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      printer(error.response.data);
      printer(error.response.status);
      printer(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      printer(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      printer(error.message);
    }
    printer(error.config);
  }
};

Bitstamp.TRANSACTIONS = {
  DEPOSIT: 0,
  WITHDRAWAL: 1,
  TRADE: 2,
  TRANSFER: 14,
  print: n => {
    switch(parseInt(n)) {
      case 0: return 'DEPOSIT';
      case 1: return 'WITHDRAWAL';
      case 2: return 'TRADE';
      case 14: return 'SUB ACCOUNT TRANSFER';
    }
  }
}
exports.Bitstamp = Bitstamp;
