pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title SVGToken
/// @author Edwin Cloud
contract SVGToken is ERC721Full, Ownable {

    string[] public images;

    constructor(string memory _name, string memory _symbol) public ERC721Full(_name, _symbol) {
    }

    /// @notice Gets svg generation metadata by id
    /// @dev The returned metadata is a string encoded json object
    /// @param _svgId The id of the svg metadata in the images array
    function getSVG(uint _svgId) public view returns (string memory) {
        return images[_svgId];

    }

    /// @notice Gets number of images owned by current address
    function getNumImages() public view returns (uint) {
        return images.length;
    }

    /// @notice Mints a new token for the current address
    /// @dev The provided string will be added to the owned images array
    /// @param _svgUri The svg generation metadata as a string encoded json object
    function mint(string memory _svgUri) public payable onlyOwner {
        uint _svgId = images.push(_svgUri);
        _mint(msg.sender, _svgId);
    }
}
