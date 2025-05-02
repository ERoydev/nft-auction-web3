// Interface to interact with the deployed RolesManager contract
interface IRolesManager {
    function hasRole(bytes32 role, address account) external view returns (bool);
}