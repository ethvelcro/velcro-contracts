pragma solidity ^0.5.0;

contract Velcro {
  mapping(bytes32 => address) owners;

  event Registered(address owner, bytes ipfsHash);
  event Unregistered(address owner, bytes ipfsHash);

  function registerWebhook(bytes calldata ipfsHash) external {
    bytes32 key = keccak256(ipfsHash);
    require(owners[key] == address(0), "This already exists");
    require(ipfsHash.length > 0, "Must provide ipfsHash");

    owners[key] = msg.sender;
    emit Registered(msg.sender, ipfsHash);
  }

  function unregisterWebhook(bytes calldata ipfsHash) external {
    bytes32 key = keccak256(ipfsHash);
    require(owners[key] == msg.sender, "Only owner can unregister");
    require(ipfsHash.length > 0, "Must provide ipfsHash");

    delete owners[key];
    emit Unregistered(msg.sender, ipfsHash);
  }

  function owner(bytes calldata ipfsHash) external view returns (address) {
    return owners[keccak256(ipfsHash)];
  }
}
