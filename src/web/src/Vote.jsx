// @format
import { useSigner, useAccount, WagmiConfig, useProvider } from "wagmi";
import { Wallet } from "ethers";
import { ConnectKitProvider, ConnectKitButton } from "connectkit";

import * as API from "./API.mjs";
import client from "./client.mjs";
import { showMessage } from "./message.mjs";

const Container = (props) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Vote {...props} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

const Vote = (props) => {
  const value = API.messageFab(props.title, props.href);
  const account = useAccount();
  const localKey = localStorage.getItem(`-kiwi-news-${account.address}-key`);
  const provider = useProvider();
  const result = useSigner();
  let signer, isError;
  if (localKey) {
    signer = new Wallet(localKey, provider);
  } else {
    signer = result.data;
    isError = result.isError;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    showMessage("Please sign the message in your wallet");
    const signature = await signer._signTypedData(
      API.EIP712_DOMAIN,
      API.EIP712_TYPES,
      value
    );
    const response = await API.send(value, signature);

    console.log(response);
    let message;
    if (response.status === "success") {
      message = "Thanks for your upvote! Have a 🥝";
    } else if (response.status === "error") {
      message = `Sad Kiwi :( "${response.details}"`;
    }
    let url = new URL(window.location.href);
    url.searchParams.set("bpc", "1");
    url.searchParams.set("message", message);
    window.location.href = url.href;
  };

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected }) => {
        return (
          <div
            onClick={(e) => {
              if (!isConnected) {
                show();
              }
              handleSubmit(e);
            }}
            className="votearrow"
            title="upvote"
          ></div>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default Container;
