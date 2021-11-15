import { ethers } from "hardhat";
import { itEach } from "mocha-it-each";
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

  describe("function countTokenExchange", () => {
    itEach(
      `testing with different values`,
      [
        {
          amount: 100000,
          price: 200,
          priceDecimals: 2,
          isBuy: true,
          tokenADecimals: 2,
          tokenBDecimals: 3,
          expectedValue: "500000",
        },
        {
          amount: 1000,
          price: 2000,
          priceDecimals: 3,
          isBuy: true,
          tokenADecimals: 3,
          tokenBDecimals: 2,
          expectedValue: "50",
        },
        {
          amount: 10000,
          price: 100,
          priceDecimals: 6,
          isBuy: true,
          tokenADecimals: 3,
          tokenBDecimals: 2,
          expectedValue: "10",
        },
        {
          amount: 1000,
          price: 3,
          priceDecimals: 5,
          isBuy: true,
          tokenADecimals: 1,
          tokenBDecimals: 2,
          expectedValue: "3",
        },
        {
          amount: 2000000,
          price: 200,
          priceDecimals: 2,
          isBuy: false,
          tokenADecimals: 4,
          tokenBDecimals: 2,
          expectedValue: "4000000000000",
        },
        {
          amount: 100,
          price: 200,
          priceDecimals: 3,
          isBuy: false,
          tokenADecimals: 2,
          tokenBDecimals: 2,
          expectedValue: "200000",
        },
        {
          amount: 500200,
          price: 200,
          priceDecimals: 9,
          isBuy: false,
          tokenADecimals: 2,
          tokenBDecimals: 3,
          expectedValue: "10004",
        },
        {
          amount: 3350,
          price: 456,
          priceDecimals: 9,
          isBuy: false,
          tokenADecimals: 2,
          tokenBDecimals: 3,
          expectedValue: "152",
        },
      ],
      async element => {
        expect(
          (
            await tokenCountMock.mockCount(
              element.amount,
              element.price,
              element.priceDecimals,
              element.isBuy,
              element.tokenADecimals,
              element.tokenBDecimals
            )
          ).toString()
        ).to.be.equal(element.expectedValue);
      }
    );
  });
});
