const SVGToken = artifacts.require("SVGToken");

module.exports = function(deployer) {
  deployer.deploy(SVGToken);
};
