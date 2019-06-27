const SVGToken = artifacts.require("./SVGToken");

contract("SVGToken", accounts => {
  // getSVG test
  it("should store the uri 'testUri1' in images array", async () => {
    const svgToken = await SVGToken.deployed();

    // Create new svgUri "testUri1"
    await svgToken.mint("testUri1", { from: accounts[0] });

    // Get test svgUri from array of images
    const storedUri = await svgToken.getSVG.call(0);

    assert.equal(storedUri, "testUri1", "The uri was not stored");
  });

  // getNumImages test
  it("should return an accurate count of svgUris in the images array", async () => {
    const svgToken = await SVGToken.deployed();

    // Create a few new svgUris
    await svgToken.mint("testUri2", { from: accounts[0] });
    await svgToken.mint("testUri3", { from: accounts[0] });
    await svgToken.mint("testUri4", { from: accounts[0] });

    // Get number of images in images array
    // Note: this should be 4 since we minted 4 since
    // the start of testing
    const numImages = await svgToken.getNumImages.call();

    assert.equal(numImages, 4, "The count is invalid");
  });
});
