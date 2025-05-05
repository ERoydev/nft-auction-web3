// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title RoleManager
 * @dev Manages roles using AccessControl. Roles include:
 * - WHITELIST_MANAGER
 * - SALES_PRICE_MANAGER
 * - PAYMENT_TOKENS_CONFIGURATOR
 * This gives me ready to use methods like: _grantRole(), hasRole(), _revokeRole() and modifier onlyRole() out of the box.
 */
abstract contract RoleManager is AccessControl {
    bytes32 public constant WHITELIST_MANAGER = keccak256("WHITELIST_MANAGER");
    bytes32 public constant SALES_PRICE_MANAGER = keccak256("SALES_PRICE_MANAGER");
    bytes32 public constant PAYMENT_TOKENS_CONFIGURATOR = keccak256("PAYMENT_TOKENS_CONFIGURATOR");

    event WhitelistManagerAdded(address account);
    event WhitelistManagerRemoved(address account);
    event SalesPriceManagerAdded(address account);
    event SalesPriceManagerRemoved(address account);
    event PaymentTokensConfiguratorAdded(address account);
    event PaymentTokensConfiguratorRemoved(address account);

    function isAdmin(address account) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function addWhitelistManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(WHITELIST_MANAGER, account);
        emit WhitelistManagerAdded(account);
    }

    function removeWhitelistManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(WHITELIST_MANAGER, account);
        emit WhitelistManagerRemoved(account);
    }

    function isWhitelistManager(address account) external view returns (bool) {
        return hasRole(WHITELIST_MANAGER, account);
    }

    function addSalesPriceManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(SALES_PRICE_MANAGER, account);
        emit SalesPriceManagerAdded(account);
    }

    function removeSalesPriceManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(SALES_PRICE_MANAGER, account);
        emit SalesPriceManagerRemoved(account);
    }

    function isSalesPriceManager(address account) external view returns (bool) {
        return hasRole(SALES_PRICE_MANAGER, account);
    }

    function addPaymentTokensConfigurator(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PAYMENT_TOKENS_CONFIGURATOR, account);
        emit PaymentTokensConfiguratorAdded(account);
    }

    function removePaymentTokensConfigurator(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(PAYMENT_TOKENS_CONFIGURATOR, account);
        emit PaymentTokensConfiguratorRemoved(account);
    }

    function isPaymentTokensConfigurator(address account) external view returns (bool) {
        return hasRole(PAYMENT_TOKENS_CONFIGURATOR, account);
    }
}
