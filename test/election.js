var Election = artifacts.require("./Election.sol");

contract("Election", function(){
    var electionInstance = null;
    it("is intilizes two candidates", function() {
        return Election.deployed().then(function(instance) {
            return instance.candidatesCount();
        }).then(function(count) {
            assert.equal(count, 2);
        })
    });

    it("it initilizises the correct value correct", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate1) {
            assert.equal(candidate1[0], 1);
            assert.equal(candidate1[1], 'Candidate 1');
            assert.equal(candidate1[2], 0);
            return electionInstance.candidates(2)
        }).then(function(candidate2) {
            assert.equal(candidate2[0], 2);
            assert.equal(candidate2[1], 'Candidate 2');
            assert.equal(candidate2[2], 0); 
        })
    });

});