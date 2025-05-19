import { ethers } from "ethers";
import { logger } from "../utils/logger"

export function safeNormalizeAddress(addr: string): string | null {
    try {
      return ethers.getAddress(addr);
    } catch {
      logger.warn("Invalid address passed to getAddress:", addr);
      return null;
    }
  }
  