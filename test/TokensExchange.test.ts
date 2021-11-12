import { ethers } from "hardhat";
import { expect } from "chai";
import {
  TokenExchange__factory,
  TokenExchange,
  TokenCount__factory,
  TokenCount,
  TestToken,
  TestToken__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("TokenExchange contract", async () => {
  let tokenA: TestToken, tokenB: TestToken;
  let tokenExchange: TokenExchange;

  let owner: SignerWithAddress;
  let second: SignerWithAddress;

  let tokenAUser: TestToken, tokenBUser: TestToken;

  let tokenCount: TokenCount;

  function convertTokens(tokens: number) {
    const wei = BigNumber.from(10).pow(18);
    const result = BigNumber.from(tokens).mul(wei);
    return result.toString();
  }

  beforeEach(async () => {
    [owner, second] = await ethers.getSigners();
    tokenA = await new TestToken__factory(owner).deploy("Token A", "TKA", 4);

    tokenB = await new TestToken__factory(owner).deploy("Token B", "TKB", 2);

    tokenCount = await new TokenCount__factory(owner).deploy();

    tokenExchange = await new TokenExchange__factory(
      { "contracts/TokenCount.sol:TokenCount": tokenCount.address },
      owner
    ).deploy(tokenA.address, tokenB.address, 1000);

    tokenAUser = tokenA.connect(second);
    tokenBUser = tokenB.connect(second);
  });

  it("correct setting owner and price of contract", async () => {
    expect(await tokenExchange.owner()).to.equal(owner.address);
    expect((await tokenExchange.price()).toString()).to.equal("1000");

    await tokenExchange.updatePrice(2000, 17, { from: owner.address });

    expect((await tokenExchange.price()).toString()).to.equal("2000");
  });

  it("exchange function works correctly", async () => {
    await tokenA.mint(owner.address, convertTokens(10000));
    await tokenB.mint(owner.address, convertTokens(10000));

    await tokenA.approve(tokenExchange.address, convertTokens(2000));
    await tokenB.approve(tokenExchange.address, convertTokens(2000));

    await tokenExchange.deposit(tokenB.address, convertTokens(2000));

    await tokenA.transfer(second.address, convertTokens(2000));

    await tokenAUser.approve(tokenExchange.address, convertTokens(1500));

    await tokenExchange.connect(second).exchange(tokenA.address, 1000);

    expect((await tokenBUser.balanceOf(second.address)).toString()).to.be.equal(
      "10000000000"
    );
  });
});
