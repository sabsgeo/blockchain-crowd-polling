var Election = artifacts.require("./Election.sol");
var QuestionsAndAnswers = artifacts.require("./QuestionsAndAnswers.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.deploy(QuestionsAndAnswers);
};
