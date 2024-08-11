// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import { IEAS, AttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

contract Attestation {
    error InvalidEAS();

    // The address of the global EAS contract.
    IEAS private immutable _eas;

    bytes32 public constant Schema = 0x33ef07c7720ee7a7fea6e650b6cfd568ca6ad29ccc834a73c9581f076c7abe7c;

    constructor(IEAS eas) {
        if (address(eas) == address(0)) {
            revert InvalidEAS();
        }

        _eas = eas;
    }

    function attestRepo(
        string memory Encrypted_GitHub_Repo,
        string memory Latest_Commit_Hash,
        string memory Demo_URL,
        string memory Real_App_URL,
        uint16 Total_Commits,
        string memory Authenticated_URL
    ) external returns (bytes32) {
        bytes32 UID = _eas.attest(
            AttestationRequest({
                schema: Schema,
                data: AttestationRequestData({
                recipient: address(0), // No recipient
                expirationTime: NO_EXPIRATION_TIME, // No expiration time
                revocable: true,
                refUID: EMPTY_UID, // No references UI
                data: abi.encode(Encrypted_GitHub_Repo, Latest_Commit_Hash, Demo_URL, Real_App_URL, Total_Commits, Authenticated_URL),
                value: 0 // No value/ETH
            })
            })
        );

        return UID;
    }
}