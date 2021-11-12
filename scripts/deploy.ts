import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { TestToken__factory, TestToken } from "../typechain-types";

let tokenA: TestToken, tokenB: TestToken;
let owner: SignerWithAddress;

const main = async () => {
  [owner] = await ethers.getSigners();

  tokenA = await new TestToken__factory(owner).deploy("Token A", "TKA", 18);

  tokenB = await new TestToken__factory(owner).deploy("Token B", "TKB", 18);

  const TokenExchange = await ethers.getContractFactory("TokenExchange");
  const MockTokenCount = await ethers.getContractFactory("MockTokenCount");
  // const TestToken = await ethers.getContractFactory("TestToken");

  await TokenExchange.deploy(tokenA.address, tokenB.address, 1000);
  await MockTokenCount.deploy();
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
