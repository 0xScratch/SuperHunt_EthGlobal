// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract SuperHuntOP {
    IPyth pyth;
    bytes32 ethUsdPriceId;

    // Exponent value for converting ETH to WEI
    int32 constant ETH_IN_WEI_EXPO = 18;

    // Bounty Struct
    struct Bounty {
        uint256 id;                 
        uint256 amountInDollars;    
        uint256 balance;            
        string title;               
        string description;         
        string instructions;        
        address creator;            
        bool isActive;              
        bool isWorldIDVerified;     
        bool isBountyPaid;          
        string solution;            // The solution submitted by the bounty hunter
        uint256 approvedSubmissions; // Count of approved submissions 
    }

    // Submission Struct
    struct Submission {
        uint256 bountyId;           
        address submitter;          
        bool isApproved;           
        bool isRepoPrivate;        // Indicates if the repository is private
        string proof;               // Link to proof or submission details
    }

    // Mappings for storage
    mapping(uint256 => Bounty) public bounties; 
    mapping(uint256 => Submission[]) public submissions; 
    uint256 public bountyCounter; // Counter for unique bounty ID

    // Owner of the contract
    address public owner;

    event BountyCreated(uint256 indexed bountyId, address indexed creator, string title);
    event BountyCancelled(uint256 indexed bountyId, address indexed creator);
    event SubmissionCreated(uint256 indexed bountyId, address indexed submitter, string proof);
    event BountyApproved(uint256 indexed bountyId, address indexed submitter, string proof, bool isRepoPublic);
    event BountyPaid(uint256 indexed bountyId, address indexed payee);
    event SolutionStored(uint256 indexed bountyId, string solution); // New event for storing solution

    constructor(address _pyth, bytes32 _ethUsdPriceId) {
        pyth = IPyth(_pyth);
        ethUsdPriceId = _ethUsdPriceId;
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Function to create bounty
    function createBounty(
        string memory _title, 
        string memory _description, 
        string memory _instructions, 
        uint256 _amountInDollars, 
        bool _isWorldIDVerified, 
        bytes[] calldata updateData
    ) external payable {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(msg.value > 0, "Amount must be greater than zero");  // Ensure a fund is sent

        bountyCounter++; // Increment the counter for the unique ID

        // Get the fee for updating the price feed
        uint updateFee = pyth.getUpdateFee(updateData);

        // Update the price feed
        pyth.updatePriceFeeds{value: updateFee}(updateData);

        // Get the current ETH price
        PythStructs.Price memory currentEthPrice = pyth.getPriceNoOlderThan(ethUsdPriceId, 60);

        // Initializing the amount in wei
        uint amountInWei;

        // Checking if the price is greater than zero
        require(currentEthPrice.price >= 0, "Price should be positive");

        // Calculating the amount in wei
        if (currentEthPrice.expo + ETH_IN_WEI_EXPO >= 0) {
            amountInWei = _amountInDollars * uint(uint64(currentEthPrice.price)) * 10**uint32(ETH_IN_WEI_EXPO + currentEthPrice.expo);
        } else {
            amountInWei = _amountInDollars * uint(uint64(currentEthPrice.price)) / 10**uint32(-(ETH_IN_WEI_EXPO + currentEthPrice.expo));
        }

        require(msg.value - updateFee >= amountInWei, "Insufficient fee");

        // Create and store the bounty
        bounties[bountyCounter] = Bounty({
            id: bountyCounter,
            amountInDollars: _amountInDollars,
            balance: amountInWei,
            title: _title,
            description: _description,
            instructions: _instructions,
            creator: msg.sender,
            isActive: true,
            isWorldIDVerified: _isWorldIDVerified,
            isBountyPaid: false,
            solution: "", // Initialize solution as empty
            approvedSubmissions: 0 // Initialize approved submissions
        });

        emit BountyCreated(bountyCounter, msg.sender, _title); // Emit event
    }

    // Function to cancel a bounty
    function cancelBounty(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];

        require(bounty.creator == msg.sender, "Only the bounty creator can cancel it");
        require(bounty.isActive, "Bounty is already inactive");
        require(bounty.approvedSubmissions == 0, "Cannot cancel, submissions have been approved");

        bounty.isActive = false;

        // Refund amount to the creator
        uint256 refundAmount = bounty.balance;

        // Ensure contract balance is sufficient for refund
        require(address(this).balance >= refundAmount, "Contract balance is insufficient");

        bounty.balance = 0; // Set balance to zero to prevent re-entrancy
        payable(bounty.creator).transfer(refundAmount); // Refund the bounty amount

        emit BountyCancelled(bountyId, msg.sender); // Emit cancellation event
    }

    // Function to approve a submission for a bounty
    function approveSubmission(uint256 bountyId, uint256 submissionIndex, bool isRepoPublic) external {
        Bounty storage bounty = bounties[bountyId];
        Submission storage submission = submissions[bountyId][submissionIndex];

        require(bounty.creator == msg.sender, "Only the bounty creator can approve submissions");
        require(bounty.isActive, "Bounty is not active");
        require(!submission.isApproved, "Submission is already approved");

        // Approve the submission
        submission.isApproved = true;
        bounty.approvedSubmissions += 1; // Increment the count of approved submissions

        emit BountyApproved(bountyId, submission.submitter, submission.proof, isRepoPublic); // Emit the approval event

        // If the repository is public, pay the submitter immediately
        if (isRepoPublic) {
            payable(submission.submitter).transfer(bounty.balance);
            bounty.isBountyPaid = true; // Mark as paid
            bounty.balance = 0; // Prevent re-entrancy
            bounty.isActive = false; // Mark bounty as completed

            emit BountyPaid(bountyId, submission.submitter); // Emit payment event
        }
    }

    // Owner can store the solution after bounty is paid
    function storeSolution(uint256 bountyId, string memory solution) external {
        require(msg.sender == owner, "Only the owner can store solutions");
        Bounty storage bounty = bounties[bountyId];

        require(bounty.isActive == false, "Bounty must be inactive to store the solution");
        require(!bounty.isBountyPaid, "Bounty has already been paid");

        bounty.solution = solution; // Store the solution
        emit SolutionStored(bountyId, solution); // Emit event for storing solution
    }

    // Function to retrieve submissions for a specific bounty
    function submitSolution(uint256 bountyId, string memory proof) external {
        require(bounties[bountyId].isActive, "Bounty is not active");
        
        // Create the submission
        submissions[bountyId].push(Submission({
            bountyId: bountyId,
            submitter: msg.sender,
            proof: proof,
            isApproved: false, // Default as false, can be updated later
            isRepoPrivate: false // Default as false, this will be updated based on actual status on client side
        }));

        emit SubmissionCreated(bountyId, msg.sender, proof); // Emit submission event
    }

    // Function to retrieve bounty details
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId]; // Return the bounty details
    }

    // Function to retrieve submissions for a specific bounty
    function getSubmissions(uint256 bountyId) external view returns (Submission[] memory) {
        return submissions[bountyId]; // Return all submissions for the specified bounty
    }

    // Function for the owner to pay any hunter if needed
    function payHunter(uint256 bountyId, address payable hunter) external {
        require(msg.sender == owner, "Only the owner can make this payment");

        Bounty storage bounty = bounties[bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(!bounty.isBountyPaid, "Bounty has already been paid");

        payable(hunter).transfer(bounty.balance);
        bounty.isBountyPaid = true; // Mark bounty as paid
        bounty.balance = 0; // Prevent re-entrancy
        bounty.isActive = false; // Mark bounty as completed

        emit BountyPaid(bountyId, hunter);
    }

    // // Function to retrieve the chain ID
    // function getChainID() external pure returns (uint256) {
    //     return CHAIN_ID;
    // }
}