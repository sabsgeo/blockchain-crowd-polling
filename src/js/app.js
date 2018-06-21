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

      // Subscribing to the votting Success Event
      App.votingSuccessEvent();

      return App.render();
    });
  },
  votingSuccessEvent: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.VoteSuccess({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, result) {
        if (!error) {
          console.log('Voting Success')
          App.render();
        }
      });
    });
  },
  render: function() {
    var electionInstance;
    
    $("#loader").show();
    $("#content").hide();

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
        
        var thenLoopCount = 0;
        for (var candidateCountIndex = 1; candidateCountIndex <= count; candidateCountIndex++ ) {

          electionInstance.candidates(candidateCountIndex).then(function(candidate) {
            if (thenLoopCount == 0) {
              $('#voting-status').empty();
              $('#candidates-select').empty();
            }
            thenLoopCount++;

            var tableContent = "<tr>\
              <th scope='row'>" + candidate[0].toNumber() + "</th>\
                <td>" + candidate[1] + "</td>\
                <td>" + candidate[2].toNumber() + "</td>\
              </tr>"
            $('#voting-status').append(tableContent)

            var selectContent = "<option value='" + candidate[0].toNumber() + "'>" + candidate[1] + "</option>";
            $('#candidates-select').append(selectContent);
          });
        }

        return electionInstance.voters(App.account);
      }).then(function(voteStatus) {
        $("#loader").hide();
        $("#content").show();
        if(voteStatus) {
          $('form').hide();
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
      return instance.vote(candidateId, {from: App.account});
    }).then(function() {
      $("#loader").show();
      $("#content").hide();
    }).catch(function(error) {
      console.warn(error);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
