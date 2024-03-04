"use client";
import { type FC } from "react";

// Import Link from next/link for navigation
import { HStack, Heading, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import logo from "public/img/logo_transparent.png";

import { useWindowSize } from "@/hooks/useWindowSize";

import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet } = useWindowSize();

  return (
    <HStack
      as="header"
      p={"0.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
    >
      <HStack>
        <Image src={logo.src} alt="logo" width={45} height={45} />
        {!isTablet && (
          <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
            Lil Stakes
          </Heading>
        )}
      </HStack>

      <HStack>
        <ConnectButton />
        <DarkModeButton />
        {/* Add a Link component wrapping a Button or another suitable component */}
        <Link href="https://www.cootie.finance/stakingcootv2Flare" passHref>
          <Button as="a">CashBREW</Button>
        </Link>
      </HStack>
    </HStack>
  );
};
export default Header;
