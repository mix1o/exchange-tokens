import { ethers } from "hardhat";
import { expect } from "chai";
import {
  MockedTokenExchange,
  MockedTokenExchange__factory,
  TokenCount,
  TokenCount__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TokenCountMock", async () => {
  let tokenCountMock: MockedTokenExchange;
  let owner: SignerWithAddress;

  let tokenCount: TokenCount;
  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    tokenCount = await new TokenCount__factory(owner).deploy();

    tokenCountMock = await new MockedTokenExchange__factory(
      { "contracts/TokenCount.sol:TokenCount": tokenCount.address },
      owner
    ).deploy();
  });

  it.only("count function", async () => {
    expect(
      (await tokenCountMock.mockCount(100, 200, 3, false, 2, 2)).toString()
    ).to.be.equal("2000");
    expect(
      (await tokenCountMock.mockCount(2000000, 200, 2, false, 4, 2)).toString()
    ).to.be.equal("40000");
    expect(
      (await tokenCountMock.mockCount(3350, 456, 2, false, 2, 3)).toString()
    ).to.be.equal("1527");
    expect(
      (await tokenCountMock.mockCount(1000, 200, 2, true, 2, 3)).toString()
    ).to.be.equal("5000");
    expect(
      (await tokenCountMock.mockCount(1000, 2000, 3, true, 3, 2)).toString()
    ).to.be.equal("50");
    expect(
      (await tokenCountMock.mockCount(10000, 2000, 8, false, 3, 2)).toString()
    ).to.be.equal("20000");
    expect(
      (await tokenCountMock.mockCount(10000, 2000, 8, true, 3, 2)).toString()
    ).to.be.equal("5000");
  });
});
