App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    
    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#account-address').html("Your account: " +  account);
      }
    });

    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      electionInstance.candidatesCount().then(function(count) {
        $('#candidate-count').html("Number of candidates competing: " + count);
        content.show();
      }).catch(function(error) {
        console.warn(error);
      });
    })
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
