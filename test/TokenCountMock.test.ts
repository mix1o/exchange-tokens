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

  describe("isBuy", async () => {
    it("decimals > 0 big amount", async () => {
      expect(
        (await tokenCountMock.mockCount(100000, 200, 2, true, 2, 3)).toString()
      ).to.be.equal("500000");
    });
    it("decimals > 0 small amount", async () => {
      expect(
        (await tokenCountMock.mockCount(1000, 2000, 3, true, 3, 2)).toString()
      ).to.be.equal("50");
    });
    it("decimals < 0 big amount", async () => {
      expect(
        (await tokenCountMock.mockCount(10000, 100, 6, true, 3, 2)).toString()
      ).to.be.equal("10");
    });
    it("decimals < 0 small amount", async () => {
      expect(
        (await tokenCountMock.mockCount(1000, 3, 5, true, 1, 2)).toString()
      ).to.be.equal("3");
    });
  });

  describe("isSell", async () => {
    it("decimals > 0 big amount", async () => {
      expect(
        (
          await tokenCountMock.mockCount(2000000, 200, 2, false, 4, 2)
        ).toString()
      ).to.be.equal("4000000000000");
    });
    it("decimals > 0 small amount", async () => {
      expect(
        (await tokenCountMock.mockCount(100, 200, 3, false, 2, 2)).toString(),
        "small amount"
      ).to.be.equal("200000");
    });

    it("decimals < 0 big amount", async () => {
      expect(
        (await tokenCountMock.mockCount(500200, 200, 9, false, 2, 3)).toString()
      ).to.be.equal("10004");
    });
    it("decimals < 0 small amount", async () => {
      expect(
        (await tokenCountMock.mockCount(3350, 456, 9, false, 2, 3)).toString()
      ).to.be.equal("152");
    });
  });
});
