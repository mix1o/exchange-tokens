import { ethers } from "hardhat";
import { expect } from "chai";
import {
  TokenExchange__factory,
  TokenExchange,
  ERC20PresetMinterPauser__factory,
  ERC20PresetMinterPauser,
  TokenCount__factory,
  TokenCount,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("TokenExchange contract", async () => {
  let tokenA: ERC20PresetMinterPauser, tokenB: ERC20PresetMinterPauser;
  let tokenExchange: TokenExchange;

  let owner: SignerWithAddress;
  let second: SignerWithAddress;

  let tokenAUser: ERC20PresetMinterPauser, tokenBUser: ERC20PresetMinterPauser;

  let tokenCount: TokenCount;

  function convertTokens(tokens: number) {
    const wei = BigNumber.from(10).pow(18);
    const result = BigNumber.from(tokens).mul(wei);
    return result.toString();
  }

  beforeEach(async () => {
    [owner, second] = await ethers.getSigners();
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

    tokenCount = await new TokenCount__factory(owner).deploy();

    tokenExchange = await new TokenExchange__factory(
      { "contracts/TokenCount.sol:TokenCount": tokenCount.address },
      owner
    ).deploy(tokenA.address, tokenB.address, 1000);

    tokenAUser = tokenA.connect(second);
    tokenBUser = tokenB.connect(second);
  });

  it("correct setting owner and price of contract", async () => {
    // const tokenExchangeAltAddress = tokenExchange.connect(second);

    expect(await tokenExchange.owner()).to.equal(owner.address);
    expect((await tokenExchange.price()).toString()).to.equal("1000");

    await tokenExchange.updatePrice(2000, { from: owner.address });

    expect((await tokenExchange.price()).toString()).to.equal("2000");
  });

  it("exchange function", async () => {
    function convertTokens(tokens: number) {
      const wei = BigNumber.from(10).pow(18);
      const result = BigNumber.from(tokens).mul(wei);
      return result.toString();
    }

    await tokenA.mint(owner.address, convertTokens(10000));
    await tokenB.mint(owner.address, convertTokens(10000));

    await tokenA.approve(tokenExchange.address, convertTokens(2000));
    await tokenB.approve(tokenExchange.address, convertTokens(2000));

    await tokenExchange.deposit(tokenB.address, convertTokens(1000));

    await tokenA.transfer(second.address, convertTokens(2000));

    await tokenAUser.approve(tokenExchange.address, convertTokens(1500));

    console.log((await tokenAUser.balanceOf(second.address)).toString());

    await tokenExchange
      .connect(second)
      .exchange(tokenA.address, convertTokens(1000));

    console.log((await tokenAUser.balanceOf(second.address)).toString());

    console.log((await tokenBUser.balanceOf(second.address)).toString());
  });

  it("exchange function", async () => {
    //1.
    await tokenA.mint(owner.address, convertTokens(1000000000));
    await tokenB.mint(owner.address, convertTokens(1000000000));
    //

    await tokenA.approve(tokenExchange.address, convertTokens(200000));
    await tokenB.approve(tokenExchange.address, convertTokens(200000));

    // 2.
    await tokenExchange.deposit(tokenB.address, convertTokens(100000));
    //

    await tokenA.transfer(second.address, convertTokens(200000));

    await tokenAUser.approve(tokenExchange.address, convertTokens(150000));

    console.log((await tokenAUser.balanceOf(second.address)).toString());

    await tokenExchange
      .connect(second)
      .exchange(tokenA.address, convertTokens(100000));

    console.log((await tokenAUser.balanceOf(second.address)).toString());

    console.log((await tokenBUser.balanceOf(second.address)).toString());

    console.log((await tokenB.balanceOf(tokenExchange.address)).toString());
  });
});
