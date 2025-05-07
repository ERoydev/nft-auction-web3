import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/Wallet/WalletContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentAccount, isAdmin, isWhitelistManager, isSalesPriceManager, isPaymentTokensConfigurator } = useWallet();
  const [loading, setLoading] = useState(true); // Loading state to handle async fetching

  // Check if the user has any admin role
  const hasAdminAccess =
    isAdmin || isWhitelistManager || isSalesPriceManager || isPaymentTokensConfigurator;

  useEffect(() => {
    if (currentAccount) {
      // Only stop loading when the account is available
      setLoading(false);
    }
  }, [currentAccount]); // When currentAccount changes, stop loading

  if (loading) {
    // Show loading state until the account is connected and roles are fetched
    return <div>Loading...</div>;
  }

  if (!hasAdminAccess) {
    // Redirect to home or another page if the user doesn't have admin access
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
