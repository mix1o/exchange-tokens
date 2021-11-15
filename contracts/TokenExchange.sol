pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenCount.sol";
import "./TestToken.sol";

contract TokenExchange is Ownable {
  address public tokenAAddress;
  address public tokenBAddress;
  uint256 public price;
  uint256 public priceDecimals = 2;
  using SafeERC20 for IERC20;

  constructor(
    address _tokenAAddress,
    address _tokenBAddress,
    uint256 _price
  ) {
    price = _price;
    tokenAAddress = _tokenAAddress;
    tokenBAddress = _tokenBAddress;
  }

  modifier contractRegistered(address _tokenAddress) {
    require(
      tokenAAddress == _tokenAddress || tokenBAddress == _tokenAddress,
      "Invalid address"
    );
    _;
  }

  function updatePrice(uint256 _price, uint256 _priceDecimals)
    public
    onlyOwner
  {
    price = _price;
    priceDecimals = _priceDecimals;
  }

  function deposit(address _tokenAddress, uint256 _amount) public onlyOwner {
    require(_amount >= 0, "Amount must be greater than 0");
    IERC20(_tokenAddress).safeTransferFrom(msg.sender, address(this), _amount);
  }

  function _transferToken(
    address _tokenAddress,
    address _tokenExchanged,
    uint256 _tokens,
    uint256 _amount
  ) internal {
    require(
      IERC20(_tokenExchanged).balanceOf(address(this)) >= _tokens,
      "Not enough tokens in deposit"
    );
    IERC20(_tokenAddress).safeTransferFrom(msg.sender, address(this), _amount);
    IERC20(_tokenExchanged).safeTransfer(msg.sender, _tokens);
  }

  function exchange(address _tokenAddress, uint256 _amount)
    public
    contractRegistered(_tokenAddress)
  {
    uint256 tokens;
    if (_tokenAddress == tokenAAddress) {
      tokens = TokenCount.countExchangedTokens(
        _amount,
        price,
        priceDecimals,
        false,
        TestToken(tokenAAddress).decimals(),
        TestToken(tokenBAddress).decimals()
      );

      _transferToken(_tokenAddress, tokenBAddress, tokens, _amount);
    } else {
      tokens = TokenCount.countExchangedTokens(
        _amount,
        price,
        priceDecimals,
        true,
        TestToken(tokenAAddress).decimals(),
        TestToken(tokenBAddress).decimals()
      );

      _transferToken(_tokenAddress, tokenAAddress, tokens, _amount);
    }
  }
}
