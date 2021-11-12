pragma solidity ^0.8.0;

import "../contracts/TokenCount.sol";

contract MockedTokenExchange {
    function mockCount(
        uint256 _amount,
        uint256 _price,
        uint256 _decimals,
        bool _isBuy,
        uint256 _tokenADecimals,
        uint256 _tokenBDecimals
    ) public pure returns (uint256) {
        uint256 tokens = TokenCount.countExchangedTokens(
            _amount,
            _price,
            _decimals,
            _isBuy,
            _tokenADecimals,
            _tokenBDecimals
        );

        return tokens;
    }
}
