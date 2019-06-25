pragma solidity >=0.4.21 <0.6.0;

contract SVGToken {
    string public myString = "Hello World";

    function set(string memory s) public {
        myString = s;
    }
}

// pragma solidity >=0.4.21 <0.6.0;
// pragma experimental ABIEncoderV2;

// contract SVGToken {
//     string[] public images;

//     function addImage (string memory str) public {
//         images.push (str);
//     }
// }
