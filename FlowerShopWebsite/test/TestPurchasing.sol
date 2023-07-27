
pragma solidity ^0.5.0;

import "truffle/Assert.sol";   // 引入的断言
import "truffle/DeployedAddresses.sol";  // 用来获取被测试合约的地址
import "../contracts/Purchasing.sol";      // 被测试合约

contract TestPurchasing {
  Purchasing purchasing = Purchasing(DeployedAddresses.Purchasing());

  // 购买测试用例
  function testUserCanPurchaseFlower() public {
    uint returnedId = purchasing.purchase(8);

    uint expected = 8;
    Assert.equal(returnedId, expected, "Purchasing of flower ID 8 should be recorded.");
  }

  // 鲜花所有者测试用例
  function testGetCustomerAddressByFlowerId() public {
    // 期望顾客的地址就是本合约地址，因为交易是由测试合约发起交易，
    address expected = address(this);
    address customer = purchasing.customers(8);
    Assert.equal(customer, expected, "Owner of flower ID 8 should be recorded.");
  }

    // 测试所有顾客
  function testGetCustomerAddressByFlowerIdInArray() public {
  // 顾客的地址就是本合约地址
    address expected = address(this);
    address[16] memory customers = purchasing.getCustomers();
    Assert.equal(customers[8], expected, "Owner of flower ID 8 should be recorded.");
  }
}