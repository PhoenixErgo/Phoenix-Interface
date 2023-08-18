import React from "react";
import { Button } from "antd";

const DisconnectNautilusWalletButton = ({
  disconnectWallet,
  setIsNautilusOpen,
}: any) => {
  const handleDisconnect = () => {
    disconnectWallet();
    setIsNautilusOpen(false);
  };
  return (
    <div>
      <Button
        size="large"
        block
        style={{
          color: "black",
          fontFamily: `'Vela Sans', sans-serif`,
          marginTop: 15,
        }}
        onClick={handleDisconnect}
      >
        Disconnect wallet
      </Button>
    </div>
  );
};

export default DisconnectNautilusWalletButton;
