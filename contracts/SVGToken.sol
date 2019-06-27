pragma solidity ^0.5.0;

// contract SVGToken {
//     string public myString = "Hello World";

//     function set(string memory s) public {
//         myString = s;
//     }
// }

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SVGToken is ERC721Full, Ownable {

    string[] public images;

    constructor(string memory _name, string memory _symbol) public ERC721Full(_name, _symbol) {
    }

    function getSVG(uint _svgId) public view returns (string memory) {
        return images[_svgId];

    }

    function getNumImages() public view returns (uint) {
        return images.length;
    }

    function mint(string memory _svgUri) public payable onlyOwner {
        uint _svgId = images.push(_svgUri);
        _mint(msg.sender, _svgId);
    }
}
