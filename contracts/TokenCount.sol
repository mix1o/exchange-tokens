pragma solidity ^0.8.0;

library TokenCount {
  function countExchangedTokens(
    uint256 _amount,
    uint256 _price,
    uint256 _priceDecimals,
    bool _isBuy,
    uint256 _tokenADecimals,
    uint256 _tokenBDecimals
  ) public pure returns (uint256) {
    int256 precision = int256(_tokenADecimals) +
      int256(_tokenBDecimals) -
      int256(_priceDecimals);

    if (precision >= 0) {
      if (!_isBuy) {
        return _amount * _price * (10**uint256(precision));
      } else {
        return (_amount * (10**uint256(precision))) / _price;
      }
    } else {
      precision *= -1;
      if (!_isBuy) {
        return (_amount * _price) / (10**uint256(precision));
      } else {
        return _amount / (10**uint256(precision)) / _price;
      }
    }
  }
}
