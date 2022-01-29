//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Adoption {

    event PetAdopted(uint petId, address owner, uint price);
    event PetReturned(uint petId, address prevOwner);

    address[16] public adopters;
    mapping (uint => uint) petIdToPrice;

    modifier validPet(uint petId) {
        require(petId >= 0 && petId <= 15);
        _;
    }

    modifier ownsPet(uint petId) {
        require(adopters[petId] == msg.sender);
        _;
    }

    // Adopting a pet
    function adopt(uint petId) public validPet(petId) returns (uint) {
        adopters[petId] = msg.sender;
        return petId;
    }

    // Give back naughty pet - updated comment
    function returnPet(uint petId) public validPet(petId) ownsPet(petId) returns (uint) {
        adopters[petId] = address(0); //Set to 0 address
        // return half of the pet cost if the owner bought the pet
        uint price = petIdToPrice[petId];
        if (price > 0) {
            payable(msg.sender).transfer(price / 2);
        }

        emit PetReturned(petId, msg.sender);
        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

    function buy(uint petId) public payable {
        console.log("%s is trying to buy pet %s for %s", msg.sender, petId, msg.value);
        require(msg.value >= 1 ether, "Pets cost at least 1 ETH cheapskate");
        adopt(petId);
        petIdToPrice[petId] = msg.value;
        emit PetAdopted(petId, msg.sender, msg.value);
    }

}
