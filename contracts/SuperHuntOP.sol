// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract SuperHuntOP {
    // Constant for the chain ID - Optimism Sepolia Testnet
    // uint256 public constant CHAIN_ID = 11155420;

    IPyth pyth;
    bytes32 ethUsdPriceId;

    // Exponent value for converting ETH to WEI
    int32 constant ETH_IN_WEI_EXPO = 18;

    // Bounty Struct
    struct Bounty {
        uint256 id;                 // Unique identifier for the bounty
        uint256 amountInDollars;    // Reward amount in dollars
        uint256 balance;            // amount in wei stored in the contract for this bounty
        string title;               // Title of the bounty
        string description;         // Description of the bounty
        string instructions;        // Instructions for the bounty
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

    constructor(address _pyth, bytes32 _ethUsdPriceId) {
        pyth = IPyth(_pyth);
        ethUsdPriceId = _ethUsdPriceId;
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
        PythStructs.Price memory currentEthPrice = pyth.getPrice(ethUsdPriceId);

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
            amount: _amountInDollars,
            balance: amountInWei,
            title: _title,
            description: _description,
            instructions: _instructions,
            creator: msg.sender,
            isActive: true,
            isWorldIDVerified: _isWorldIDVerified
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
        uint256 refundAmount = bounty.balance;

        // Ensure contract balance is sufficient for refund
        require(address(this).balance >= refundAmount, "Contract balance is insufficient");

        bounty.balance = 0; // Set balance to zero to prevent re-entrancy
        payable(bounty.creator).transfer(refundAmount); // Refund the bounty amount

        emit BountyCancelled(bountyId, msg.sender); // Emit cancellation event
    }

    // Function to retrieve bounty details
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId]; // Return the bounty details
    }

    // // Function to retrieve the chain ID
    // function getChainID() external pure returns (uint256) {
    //     return CHAIN_ID;
    // }
}