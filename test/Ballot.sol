pragma solidity >=0.4.22 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Ballot.sol";

contract TestBallot {

    Ballot ballotToTest;
    bytes32[] proposals;

    // run before all tests
    function beforeAll () public {
        // push two proposals to byte array
       proposals.push(bytes32("proposal1"));
       proposals.push(bytes32("proposal2"));
       // initialize a new Ballot
       ballotToTest = new Ballot(proposals);
    }

    // Test vote() and winningProposal()
    function testWinningProposal() public {
        ballotToTest.vote(1);
        Assert.equal(ballotToTest.winningProposal(), uint(1), "index 1 should be the winning proposal");
    }

    // Test winnerName()
    function testWinnerName() public {
        Assert.equal(ballotToTest.winnerName(), bytes32("proposal2"), "proposal2 should be the winner name");
    }
}

