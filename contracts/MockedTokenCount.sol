pragma solidity ^0.8.0;

import "../contracts/TokenCount.sol";

contract MockedTokenExchange{
    function mockCount(uint _amount, uint _price, uint _decimals, bool _isBuy, uint _tokenADecimals, uint _tokenBDecimals) public pure returns(uint){
        uint tokens = TokenCount.countExchangedTokens(_amount, _price, _decimals, _isBuy, _tokenADecimals, _tokenBDecimals);

        return tokens;
    }
}