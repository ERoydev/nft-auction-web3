// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseNFTTest} from "./BaseNFTTest.t.sol";
import {ERC20Mock} from "../src/utils/ERC20Mock.sol";
import { NFT} from "../src/NFT.sol";

contract RoleManagerTest is BaseNFTTest {

    event WhitelistManagerAdded(address indexed account);
    event WhitelistManagerRemoved(address indexed account);
    event SalesPriceManagerAdded(address indexed account);
    event SalesPriceManagerRemoved(address indexed account);
    event PaymentTokensConfiguratorAdded(address indexed account);
    event PaymentTokensConfiguratorRemoved(address indexed account);

    function testOnlyAdminCanAddWhitelistManager() public {

        vm.prank(addr1);
        vm.expectRevert();
        nft.addWhitelistManager(addr2);

        assertFalse(nft.isWhitelistManager(addr2));

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit WhitelistManagerAdded(addr2);

        nft.addWhitelistManager(addr2);

        assertTrue(nft.isWhitelistManager(addr2));
    }

    function testRemoveWhiteListManager() public {
        vm.prank(owner);
        nft.addWhitelistManager(addr2);
        assertTrue(nft.isWhitelistManager(addr2));

        vm.prank(addr1);
        vm.expectRevert();
        nft.removeWhitelistManager(addr2);

        assertTrue(nft.isWhitelistManager(addr2));

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit WhitelistManagerRemoved(addr2);

        nft.removeWhitelistManager(addr2);
        assertFalse(nft.isWhitelistManager(addr2));
    }

    function testOnlyAdminCanAddSalesPriceManager() public {
        vm.prank(addr1);
        vm.expectRevert();
        nft.addSalesPriceManager(addr2);
        assertFalse(nft.isSalesPriceManager(addr2));

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit SalesPriceManagerAdded(addr2);

        nft.addSalesPriceManager(addr2);
        assertTrue(nft.isSalesPriceManager(addr2));
    }

    function testRemoveAddSalesPriceManager() public {
        assertFalse(nft.isSalesPriceManager(addr2));

        vm.prank(owner);
        nft.addSalesPriceManager(addr2);
        assertTrue(nft.isSalesPriceManager(addr2));

        vm.prank(addr1);
        vm.expectRevert();
        nft.removeSalesPriceManager(addr2);
        assertTrue(nft.isSalesPriceManager(addr2));

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit SalesPriceManagerRemoved(addr2);

        nft.removeSalesPriceManager(addr2);

        assertFalse(nft.isSalesPriceManager(addr2));
    }


    function testOnlyAdminCanAddPaymentTokensConfigurator() public {
        vm.prank(addr1);
        vm.expectRevert();
        nft.addPaymentTokensConfigurator(addr2);
        assertFalse(nft.isPaymentTokensConfigurator(addr2));

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit PaymentTokensConfiguratorAdded(addr2);

        nft.addPaymentTokensConfigurator(addr2);

        assertTrue(nft.isPaymentTokensConfigurator(addr2));
    }

    function testRemovePaymentTokensConfigurator() public {
        assertFalse(nft.isPaymentTokensConfigurator(addr2));

        vm.prank(owner);
        nft.addPaymentTokensConfigurator(addr2);
        assertTrue(nft.isPaymentTokensConfigurator(addr2));

        vm.prank(addr1);
        vm.expectRevert();
        nft.removePaymentTokensConfigurator(addr2);
        assertTrue(nft.isPaymentTokensConfigurator(addr2));

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit PaymentTokensConfiguratorRemoved(addr2);
        
        nft.removePaymentTokensConfigurator(addr2);
        assertFalse(nft.isPaymentTokensConfigurator(addr2));
    }

    function testOnlyWhitelistManagerModifier() public {
        vm.prank(owner);
        nft.addWhitelistManager(addr2);

        vm.prank(addr2);
        bool success;
        try nft.setMerkleRoot(bytes32("0xdead")) {
            success = true;
        } catch {
            success = false;
        }

        assertTrue(success, "whitelist manager should be allowed to set merkle root");
    }

    function testOnlyAdminOrWhitelistManagerAccess() public {
        vm.prank(addr2);
        vm.expectRevert("Not an admin or a whitelist manager");
        nft.setMerkleRoot(bytes32("0xbeef"));
    }

    function testStateVariablesWhenInit() public view {
        assertEq(nft.WHITELIST_MANAGER(), keccak256("WHITELIST_MANAGER"));
        assertEq(nft.SALES_PRICE_MANAGER(), keccak256("SALES_PRICE_MANAGER"));
        assertEq(nft.PAYMENT_TOKENS_CONFIGURATOR(), keccak256("PAYMENT_TOKENS_CONFIGURATOR"));
    }
}
