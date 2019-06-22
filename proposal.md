# SVGToken

### Token Type

ERC721

### Use Case

I wanted create a way for art to be generated using the blockchain. So far I can only find examples of asci art being actually stored on the blockchain (crypto punks are stored off the blockchain). My idea is to randomize svg paths and colors to generate perhaps interesting images.

### Examine

Storing a byte representation or base64 representation of an image on the blockchain is not sustainable but I think storing svg data is achievable.

### Description

I will make a react website using Drizzle and a solidity contract. The website will be fairly basic but will have login and signup and a profile. The profile will have a wallet address and can purchase generative art or view their existing purchases. For the first iteration I am not sure I will have time to make a marketplace for other users to trade pieces.

### High Level Plan

1. Create basic website using drizzle by following the getting started tutorial.
2. Create a basic version of the contract that just takes an array of existing paths and returns a random pre generated path.
3. Create a test page for the website to verify how this works.
4. Create signup, login, and profile pages.
5. Integrate a purchase page into the profile.
6. Create a view purchases page.
7. Work on making the images randomly generated.
