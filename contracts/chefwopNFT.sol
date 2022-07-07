// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ChefWopNFT is ERC1155, Ownable {

    address public admin;
    string public name;
    string public symbol;
    uint256 public tokenCount;
    string public baseUri;
    mapping(bytes => uint) public sigs;

    constructor(string memory _name, string memory _symbol, string memory _baseUri) ERC1155(_baseUri) {
        name = _name;
        symbol = _symbol;
        baseUri = _baseUri;
    }

    function mint(uint256 amount, uint256 id, uint256 rval, bytes calldata signature) public {
        require(recoverSigner(kekkaMessage(amount, id, rval), signature) == owner() , 'wrong signature');
        require(sigs[signature] == 0, 'already signature');
        require(amount==1, "Only one token can be minted at a time!");
        require(balanceOf(msg.sender, id) <= 1, "Max balance for token is 1!");
        sigs[signature] = 1;
        _mint(msg.sender, id, amount, "");
    }

    function uri(uint256 _tokenId) override public view returns(string memory) {
        return string(
                abi.encodePacked(
                        baseUri,
                        Strings.toString(_tokenId),
                        ".json"
                    )
            );
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
      return keccak256(abi.encodePacked(
        '\x19Ethereum Signed Message:\n32',
        hash
      ));
    }

    function kekkaMessage(uint256 amount, uint256 id, uint256 rval) internal pure returns (bytes32) {
      bytes32 message = prefixed(keccak256(abi.encodePacked(amount, id, rval)));
      return message;
    }

    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
      uint8 v;
      bytes32 r;
      bytes32 s;
      (v, r, s) = splitSignature(sig);
      return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
      require(sig.length == 65);
      bytes32 r;
      bytes32 s;
      uint8 v;
      assembly {
          // first 32 bytes, after the length prefix
          r := mload(add(sig, 32))
          // second 32 bytes
          s := mload(add(sig, 64))
          // final byte (first byte of the next 32 bytes)
          v := byte(0, mload(add(sig, 96)))
      }
      return (v, r, s);
    }

}
