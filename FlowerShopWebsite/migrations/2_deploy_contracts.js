
var Purchasing = artifacts.require("./Purchasing.sol");

module.exports = function(deployer) {
  deployer.deploy(Purchasing);
};
