import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
  ERC20PresetMinterPauser__factory,
  ERC20PresetMinterPauser,
} from "../typechain-types";

let tokenA: ERC20PresetMinterPauser, tokenB: ERC20PresetMinterPauser;
let owner: SignerWithAddress;

const main = async () => {
  [owner] = await ethers.getSigners();

  tokenA = await new ERC20PresetMinterPauser__factory(owner).deploy(
    "Token A",
    "TKA",
    18
  );

  tokenB = await new ERC20PresetMinterPauser__factory(owner).deploy(
    "Token B",
    "TKB",
    18
  );

  const TokenExchange = await ethers.getContractFactory("TokenExchange");
  const TokenCount = await ethers.getContractFactory("TokenCount");
  const MockTokenCount = await ethers.getContractFactory("MockTokenCount");

  const hardhatTokenExchange = await TokenExchange.deploy(
    tokenA.address,
    tokenB.address,
    1000
  );
  const hardhatTokenCount = await TokenCount.deploy();
  const hardhatMockTokenCount = await MockTokenCount.deploy();

  console.log(hardhatTokenExchange.address);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
