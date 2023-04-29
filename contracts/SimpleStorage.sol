// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SimpleStorage {
    string public message; // By saying this is a public variable, it will automatically create a message() getter, so no need to define a getMessage() function
    address public owner;

    event NewMessage(string indexed message);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this method");
        _;
    }

    constructor(string memory _message) {
        message = _message;
        owner = msg.sender;
    }

    function setMessage(string memory newMessage) public onlyOwner {
        message = newMessage;
        emit NewMessage(message);
    }
}
