const SVGToken = artifacts.require("./SVGToken");

contract("SVGToken", accounts => {
  it("should store the string 'Hey there!'", async () => {
    const svgToken = await SVGToken.deployed();

    // Set myString to "Hey there!"
    await svgToken.set("Hey there!", { from: accounts[0] });

    // Get myString from public variable getter
    const storedString = await svgToken.myString.call();

    assert.equal(storedString, "Hey there!", "The string was not stored");
  });
});
