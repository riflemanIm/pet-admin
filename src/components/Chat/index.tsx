import React from "react";
import { ChatIndex, ChatPageProps } from "@pmt/chat";
import { useUserState } from "../../context/UserContext";

interface ChatProps extends ChatPageProps {
  lang: "ru" | "en" | "fr";
  chatServerAddress: string;
}

const Chat = ({ lang = "ru", chatServerAddress, ...props }: ChatProps) => {
  const { token, refreshToken } = useUserState();

  const chatURL = new URL(chatServerAddress);

  return (
    <ChatIndex
      lang={lang}
      chatBaseURLApi={`https://${chatURL.host}${chatURL.pathname || ""}`}
      chatWsUrl={`wss://${chatURL.host}`}
      chatWsPath={`${chatURL.pathname || "/"}socket.io`}
      token={token!}
      refreshToken={refreshToken!}
      {...props}
    />
  );
};

export default Chat;
