// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract RoleManager is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant WHITELIST_MANAGER = keccak256("WHITELIST_MANAGER");
    bytes32 public constant SALES_PRICE_MANAGER = keccak256("SALES_PRICE_MANAGER");
    bytes32 public constant PAYMENT_TOKENS_CONFIGURATOR = keccak256("PAYMENT_TOKENS_CONFIGURATOR");

     function addWhitelistManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(WHITELIST_MANAGER, account);
    }

    function removeWhitelistManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(WHITELIST_MANAGER, account);
    }

    function isWhitelistManager(address account) external view returns (bool) {
        return hasRole(WHITELIST_MANAGER, account);
    }

    function addSalesPriceManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(SALES_PRICE_MANAGER, account);
    }

    function removeSalesPriceManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(SALES_PRICE_MANAGER, account);
    }

    function isSalesPriceManager(address account) external view returns (bool) {
        return hasRole(SALES_PRICE_MANAGER, account);
    }

    function addPaymentTokensConfigurator(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PAYMENT_TOKENS_CONFIGURATOR, account);
    }

    function removePaymentTokensConfigurator(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(PAYMENT_TOKENS_CONFIGURATOR, account);
    }

    function isPaymentTokensConfigurator(address account) external view returns (bool) {
        return hasRole(PAYMENT_TOKENS_CONFIGURATOR, account);
    }
}
