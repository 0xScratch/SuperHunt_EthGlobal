// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract SuperHuntOP {
    // Constant for the chain ID - Optimism Sepolia Testnet
    uint256 public constant CHAIN_ID = 11155420;

    // Bounty Struct
    struct Bounty {
        uint256 id;                 // Unique identifier for the bounty
        uint256 amount;             // Reward amount in wei
        string title;               // Title of the bounty
        string description;         // Description of the bounty
        string instructions;         // Instructions for the bounty
        address creator;            // Creator of the bounty
        bool isActive;              // Status of the bounty (active or completed)
        bool isWorldIDVerified;     // Indicates if the creator is World ID verified
    }

    // Mapping and Counter for storing bounties
    mapping(uint256 => Bounty) public bounties; // Stores bounties by ID
    uint256 public bountyCounter; // Counter for unique bounty ID

    // Event for bounty creation
    event BountyCreated(uint256 indexed bountyId, address indexed creator, string title);
    // Event for bounty cancellation
    event BountyCancelled(uint256 indexed bountyId, address indexed creator);

    // Function to create bounty
    function createBounty(string memory _title, string memory _description, string memory _instructions, bool _isWorldIDVerified) external payable {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(msg.value > 0, "Amount must be greater than zero");  // Ensure a fund is sent

        bountyCounter++; // Increment the counter for the unique ID

        // Create and store the bounty
        bounties[bountyCounter] = Bounty({
            id: bountyCounter,
            creator: msg.sender,
            title: _title,
            description: _description,
            amount: msg.value,
            isActive: true,
            isWorldIDVerified: _isWorldIDVerified,
            instructions: _instructions
        });

        emit BountyCreated(bountyCounter, msg.sender, _title); // Emit event
    }

    // Function to cancel a bounty
    function cancelBounty(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];

        require(bounty.creator == msg.sender, "Only the bounty creator can cancel it");
        require(bounty.isActive, "Bounty is already inactive");

        // Mark bounty as inactive
        bounty.isActive = false;

        // Refund amount to the creator
        uint256 refundAmount = bounty.amount;
        bounty.amount = 0; // Set amount to zero to prevent re-entrancy
        payable(bounty.creator).transfer(refundAmount); // Refund the bounty amount

        emit BountyCancelled(bountyId, msg.sender); // Emit cancellation event
    }

    // Function to retrieve bounty details
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId]; // Return the bounty details
    }

    // Function to retrieve the chain ID
    function getChainID() external pure returns (uint256) {
        return CHAIN_ID;
    }
}