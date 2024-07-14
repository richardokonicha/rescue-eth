// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SimpleContract {
    // State variable to store a message
    string private message;

    // Function to set the message
    function setMessage(string memory _newMessage) external {
        message = _newMessage;
    }

    // Function to get the message
    function getMessage() external view returns (string memory) {
        return message;
    }
}
