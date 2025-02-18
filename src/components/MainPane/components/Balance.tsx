import type { FC } from "react";

import { useAccount, useBalance } from "wagmi";

import { InfoText } from "@/components";

const Balance: FC = (): JSX.Element => {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
    watch: true,
  });

  const displayBalance = data?.formatted ? `Ξ ${data?.formatted}` : "0";

  return <InfoText label="FLR" value={displayBalance} />;
};

export default Balance;
