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
        
        for (var candidateCountIndex = 1; candidateCountIndex <= count; candidateCountIndex++ ) {
          console.log(candidateCountIndex);
          electionInstance.candidates(candidateCountIndex).then(function(candidate) {
            console.log(candidate[0].toNumber());
            console.log(candidate[1]);
            console.log(candidate[2].toNumber());
            var tableContent = "<tr>\
              <th scope='row'>" + candidate[0].toNumber() + "</th>\
                <td>" + candidate[1] + "</td>\
                <td>" + candidate[2].toNumber() + "</td>\
              </tr>"
            $('#voting-status').append(tableContent)

            var selectContent = "<option value='" + candidate[0].toNumber() + "'>" + candidate[1] + "</option>";
            $('#candidates-select').append(selectContent)
          });
        }

        return electionInstance.voters(App.account);
      }).the(function(voteStatus) {
        if(voteStatus) {
          $('form').hide();
          loader.hide();
          content.show();
        }
      })
      .catch(function(error) {
        console.warn(error);
      });
    })
  },
  castVote: function() {
    var candidateId = $('#candidates-select').val();
    App.contracts.Election.deployed().then(function(instance) {
      instance.vote(candidateId, {from: App.account});
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
