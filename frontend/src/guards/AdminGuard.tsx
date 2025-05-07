import React from "react";
import { Navigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isWhitelistManager, isSalesPriceManager, isPaymentTokensConfigurator } = useWallet();

  // Check if the user has any admin role
  const hasAdminAccess = isAdmin || isWhitelistManager || isSalesPriceManager || isPaymentTokensConfigurator;

  if (!hasAdminAccess) {
    // Redirect to home or another page if the user doesn't have admin access
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;