import React, { useEffect, useState } from "react";

import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import Spline from "@splinetool/react-spline";
import { ethers } from "ethers";
import { useContractRead, useContractWrite, useAccount } from "wagmi";

const stakingContractAddress = "0xb41e682E276aa0F9B89F94020A1AAb370c9a628a";

const StakingPage = () => {
  const toast = useToast();
  const { address } = useAccount();
  const [nftCount, setNftCount] = useState(0);
  const [rewards, setRewards] = useState("0");
  const [bonusMultiplier, setBonusMultiplier] = useState("0");
  const [showStats, setShowStats] = useState(false); // New state to control visibility

  // Fetch NFT count
  const { data: nftCountData } = useContractRead({
    abi: stakingABI,
    address: stakingContractAddress,
    functionName: "getNftCount",
    args: [address],
  });

  // Fetch rewards
  const { data: rewardsData } = useContractRead({
    abi: stakingABI,
    address: stakingContractAddress,
    functionName: "calculateRewards",
    args: [address],
  });

  // Fetch bonus multiplier
  const { data: bonusMultiplierData } = useContractRead({
    abi: stakingABI,
    address: stakingContractAddress,
    functionName: "getBonusMultiplier",
  });

  // Claim rewards
  const { write: claimRewards, isLoading: isClaiming } = useContractWrite({
    address: stakingContractAddress,
    abi: stakingABI,
    functionName: "claimRewards",
    onError(error) {
      toast({
        title: "Error",
        description: `Failed to claim rewards: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    // Delay showing the stats
    const timer = setTimeout(() => {
      setShowStats(true); // Enable stats display after 3 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (showStats) {
      if (nftCountData) setNftCount(parseInt(nftCountData.toString(), 10));

      // Convert rewards from wei to ether
      if (rewardsData) setRewards(ethers.formatEther(rewardsData.toString()).substring(0, 6));

      if (bonusMultiplierData) setBonusMultiplier(bonusMultiplierData.toString());
    }
  }, [nftCountData, rewardsData, bonusMultiplierData, showStats]);

  // Adjust these styles to position elements correctly over your Spline design
  const buttonStyles = {
    position: "absolute",
    pointerEvents: "auto",
    bottom: ["46%", "30%", "45%"], // Example for different breakpoints
    left: ["52%", "36%", "58%"],
    transform: "translateX(-50%)",
    opacity: 0,
    zIndex: 0,
    width: ["150px", "175px", "200px", "485px"], // values for different breakpoints
    height: ["50px", "75px", "85px", "100px"],
  };

  const statsStyles = {
    position: "absolute",
    top: ["39%", "38%", "39%"], // Example for different breakpoints
    left: ["77%", "63%", "69%"], // Adjust according to your design
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 10,
    color: "white",
    textAlign: "left",
  };

  const rewwardStyles = {
    position: "absolute",
    top: ["36%", "32%", "36%"], // Example for different breakpoints
    left: ["32%", "52%", "49%"], // Adjust according to your design
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 10,
    color: "white",
    textAlign: "left",
  };

  return (
    <Box position="relative" textAlign="center" fontSize="xl" h="100vh" w="full">
      <Spline scene="https://prod.spline.design/UgFw9HTogjpqVCVM/scene.splinecode" />
      <Button sx={buttonStyles} onClick={() => claimRewards()} isLoading={isClaiming} />

      {showStats && ( // Conditional rendering based on showStats
        <>
          <VStack sx={statsStyles} spacing={4}>
            <Text fontSize="lg">{nftCount}</Text>
            <Text fontSize="lg"> {bonusMultiplier}</Text>
          </VStack>
          <VStack sx={rewwardStyles} spacing={4}>
            <Text fontSize="lg">{rewards} Tokens</Text>
          </VStack>
        </>
      )}
    </Box>
  );
};

export default StakingPage;

const stakingABI = [
  {
    type: "constructor",
    inputs: [
      { type: "address", name: "_rewardsToken", internalType: "contract IERC20" },
      { type: "address", name: "_nftCollection", internalType: "contract IERC721Enumerable" },
      { type: "uint256", name: "_rewardsPerNftPerHour", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
    name: "ADMIN_ROLE",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "addAdmin",
    inputs: [{ type: "address", name: "account", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "bonusPercentPerTier",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "calculateBonusMultiplier",
    inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "calculateRewards",
    inputs: [{ type: "address", name: "user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "claimRewards",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "firstClaimAmount",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256[]", name: "tiers", internalType: "uint256[]" },
      { type: "uint256[]", name: "bonuses", internalType: "uint256[]" },
    ],
    name: "getAllTierInfo",
    inputs: [{ type: "address", name: "user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getBonusMultiplier",
    inputs: [{ type: "address", name: "user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getNftCount",
    inputs: [{ type: "address", name: "user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getRewardsBalance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
    name: "getRoleAdmin",
    inputs: [{ type: "bytes32", name: "role", internalType: "bytes32" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getTier",
    inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getTierDuration",
    inputs: [{ type: "uint256", name: "tier", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "tierLevel", internalType: "uint256" },
      { type: "uint256", name: "bonusMultiplier", internalType: "uint256" },
    ],
    name: "getTierInfo",
    inputs: [{ type: "uint256", name: "tokenId", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "grantRole",
    inputs: [
      { type: "bytes32", name: "role", internalType: "bytes32" },
      { type: "address", name: "account", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "hasRole",
    inputs: [
      { type: "bytes32", name: "role", internalType: "bytes32" },
      { type: "address", name: "account", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "modifyNftTiers",
    inputs: [
      { type: "uint256", name: "tokenId", internalType: "uint256" },
      { type: "uint256", name: "newTier", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract IERC721Enumerable" }],
    name: "nftCollection",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "nftHoldingStartTime",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "nftTier",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "renounceRole",
    inputs: [
      { type: "bytes32", name: "role", internalType: "bytes32" },
      { type: "address", name: "callerConfirmation", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "revokeRole",
    inputs: [
      { type: "bytes32", name: "role", internalType: "bytes32" },
      { type: "address", name: "account", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "rewardsPerNftPerHour",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract IERC20" }],
    name: "rewardsToken",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setNftHoldingStartTime",
    inputs: [
      { type: "uint256", name: "tokenId", internalType: "uint256" },
      { type: "uint256", name: "startTime", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "supportsInterface",
    inputs: [{ type: "bytes4", name: "interfaceId", internalType: "bytes4" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "tier1Duration",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "tier2Duration",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "tier3Duration",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "tier4Duration",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "tier5Duration",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateBonusPercentPerTier",
    inputs: [{ type: "uint256", name: "_bonusPercentPerTier", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateFirstClaimAmount",
    inputs: [{ type: "uint256", name: "_firstClaimAmount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateRewardsPerNftPerHour",
    inputs: [{ type: "uint256", name: "_rewardsPerNftPerHour", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateTierDurations",
    inputs: [
      { type: "uint256", name: "_tier1Duration", internalType: "uint256" },
      { type: "uint256", name: "_tier2Duration", internalType: "uint256" },
      { type: "uint256", name: "_tier3Duration", internalType: "uint256" },
      { type: "uint256", name: "_tier4Duration", internalType: "uint256" },
      { type: "uint256", name: "_tier5Duration", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdrawRewards",
    inputs: [{ type: "uint256", name: "amount", internalType: "uint256" }],
  },
  {
    type: "event",
    name: "BonusPercentPerTierUpdated",
    inputs: [{ type: "uint256", name: "newBonusPercentPerTier", indexed: false }],
    anonymous: false,
  },
  {
    type: "event",
    name: "FirstClaimAmountUpdated",
    inputs: [{ type: "uint256", name: "newFirstClaimAmount", indexed: false }],
    anonymous: false,
  },
  {
    type: "event",
    name: "NftTierModified",
    inputs: [
      { type: "uint256", name: "tokenId", indexed: false },
      { type: "uint256", name: "newTier", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardsClaimed",
    inputs: [
      { type: "address", name: "user", indexed: true },
      { type: "uint256", name: "amount", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardsPerNftPerHourUpdated",
    inputs: [{ type: "uint256", name: "newRewardsPerNftPerHour", indexed: false }],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAdminChanged",
    inputs: [
      { type: "bytes32", name: "role", indexed: true },
      { type: "bytes32", name: "previousAdminRole", indexed: true },
      { type: "bytes32", name: "newAdminRole", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleGranted",
    inputs: [
      { type: "bytes32", name: "role", indexed: true },
      { type: "address", name: "account", indexed: true },
      { type: "address", name: "sender", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleRevoked",
    inputs: [
      { type: "bytes32", name: "role", indexed: true },
      { type: "address", name: "account", indexed: true },
      { type: "address", name: "sender", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TierDurationsUpdated",
    inputs: [
      { type: "uint256", name: "tier1Duration", indexed: false },
      { type: "uint256", name: "tier2Duration", indexed: false },
      { type: "uint256", name: "tier3Duration", indexed: false },
      { type: "uint256", name: "tier4Duration", indexed: false },
      { type: "uint256", name: "tier5Duration", indexed: false },
    ],
    anonymous: false,
  },
  { type: "error", name: "AccessControlBadConfirmation", inputs: [] },
  {
    type: "error",
    name: "AccessControlUnauthorizedAccount",
    inputs: [
      { type: "address", name: "account", internalType: "address" },
      { type: "bytes32", name: "neededRole", internalType: "bytes32" },
    ],
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [{ type: "address", name: "target", internalType: "address" }],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [{ type: "address", name: "account", internalType: "address" }],
  },
  { type: "error", name: "FailedInnerCall", inputs: [] },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ type: "address", name: "token", internalType: "address" }],
  },
];
