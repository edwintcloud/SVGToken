//=======================================================================
// File: Ballot.js
//
// Desc: Test file for Ballot contract.
//
// Copyright © 2019 Edwin Cloud. All rights reserved.
//=======================================================================


// import Ballot contract
const Ballot = artifacts.require("Ballot");

// Define Ballot tests
contract("Ballot tests", async () => {

    //-------------------------------------------------------------------
    // Global Variables
    //-------------------------------------------------------------------

    // The Ballot instance to be used for tests.
    let ballotTest;

    // An array of proposals.
    const proposals = [
        web3.utils.fromUtf8("proposal1"),
        web3.utils.fromUtf8("proposal2")
    ];

    //-------------------------------------------------------------------
    // Hooks
    //-------------------------------------------------------------------

    // Initializes ballotTest before any tests are run.
    before("initialize ballotTest instance", async () => {
        ballotTest = await Ballot.new(proposals);
    });

    //-------------------------------------------------------------------
    // Tests
    //-------------------------------------------------------------------

    // Test vote() and winningProposal()
    it("should return index 1 as the winning proposal", async () => {
        await ballotTest.vote(1); // we must vote first
        const winningProposal = await ballotTest.winningProposal();
        assert.equal(winningProposal, 1);
    });

    // Test winnerName()
    it("should return proposal2 as the winner name", async () => {
        const winnerName = await ballotTest.winnerName();
        assert.equal(web3.utils.toUtf8(winnerName), "proposal2");
    });
});