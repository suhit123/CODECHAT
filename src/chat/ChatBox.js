import { useContext, useEffect, useRef, useState } from "react";
import { useFetchRecipient } from "../hooks/fetchRecipient";
import { ChatContext } from "../context/chatContext";
import "../styles/ChatBox.css";
import { useAuth } from "../context/AuthContext";
import logo1 from "../resources/logo1.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import img11 from "../resources/img11.png";
import img10 from "../resources/img10.png";
import img17 from "../resources/img17.gif";
import EmojiPicker from "emoji-picker-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

const ChatBox = () => {
  const [isYes, setIsYes] = useState(false);
  const bottomRef = useRef(null);
  const {
    messages,
    sendText,
    currentChat,
    checkChat,
    isOthertyping,
    isMessagesLoading,
    onLineUsers,
  } = useContext(ChatContext);
  const { userData } = useAuth();
  const [textMessage, setTextMessage] = useState("");
  const { recipientUser } = useFetchRecipient(currentChat, userData);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (event.currentTarget.performance) {
        const navigationType = event.currentTarget.performance.navigation.type;
        if (navigationType === PerformanceNavigation.TYPE_RELOAD) {
          checkChat(false);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const handleCopyClick = async (message) => {
    const textToCopy = `${message}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Text successfully copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy text to clipboard: ", err);
    }
  };
  return (
    <div className="chat_box_container">
      {messages && userData ? (
        <div className="chat_box_container_main">
          <div className="chat_box_nav">
            <div className="chat_box_nav_left">
              <img
                src={
                  recipientUser && recipientUser.Profile
                    ? require(`../resources/${recipientUser?.Profile}.png`)
                    : logo1
                }
                alt=""
              />
              <div className="chat_box_nav_left_right">
                <h3>{recipientUser?.Name}</h3>
                {isOthertyping?.istyping &&
                currentChat?.members?.find(
                  (item) => item === isOthertyping?.currentId
                ) ? (
                  <p className="online">typing...</p>
                ) : onLineUsers?.some(
                    (item) => item.userId === recipientUser?.id
                  ) ? (
                  <p className="online">Online</p>
                ) : (
                  <p className="offline">Offline</p>
                )}
              </div>
            </div>
          </div>
          <div className="chat_box_chats">
            {messages.map((message, index) => {
              const hours =
                message?.createdAt.split("T")[1].split(".")[0].split(":")[0] ||
                "00:00";
              const minutes =
                message?.createdAt.split("T")[1].split(".")[0].split(":")[1] ||
                "00:00";
              return (
                <div key={index}>
                  <div
                    className={
                      userData.id === message.senderId
                        ? "chat_message_self"
                        : `chat_message_opponent`
                    }
                  >
                    <img
                      src={
                        recipientUser && recipientUser.Profile
                          ? require(`../resources/${
                              userData?.id === message?.senderId
                                ? userData?.Profile
                                : recipientUser?.Profile
                            }.png`)
                          : logo1
                      }
                      alt=""
                    />
                    {message?.text?.search("code_12974##") ? (
                      <p>
                        {message?.text?.split("\n").map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                        <span>
                          {hours}:{minutes} {hours > 12 ? "PM" : "AM"}
                        </span>
                      </p>
                    ) : (
                      <div>
                        <SyntaxHighlighter
                          language="javascript"
                          style={darcula}
                          showLineNumbers
                        >
                          {message?.text?.split("code_12974##")[1]}
                        </SyntaxHighlighter>
                        <div>
                          <img
                            className="clipboard_png"
                            src={img10}
                            onClick={()=>handleCopyClick(message?.text?.split("code_12974##")[1])}
                            alt="i"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div className="chat_input_box">
            <div className="chat_input_box_relative">
              <textarea
                className="textarea_"
                placeholder="Type something"
                value={textMessage}
                onChange={(e) => {
                  checkChat(e.target.value.length !== 0);
                  console.log(textMessage);
                  setTextMessage(e.target.value);
                }}
              ></textarea>
              <div className="send_text_emoji_select">
                <div className="code_text_toggler">
                  <button
                    className={`send_text_emoji_select_button1 ${
                      isYes ? "activate_toggle" : ""
                    }`}
                    onClick={() => setIsYes(true)}
                  >
                    Code
                  </button>
                  <button
                    className={`send_text_emoji_select_button1 ${
                      isYes ? "" : "activate_toggle"
                    }`}
                    onClick={() => setIsYes(false)}
                  >
                    Text
                  </button>
                </div>
                <Popup
                  trigger={
                    <button className="emoji_selector">
                      <img src={img11} alt="emoji" />
                    </button>
                  }
                  position="top right"
                >
                  <EmojiPicker
                    onEmojiClick={(e, emojiObject) => {
                      setTextMessage(textMessage + emojiObject.emoji);
                    }}
                  />
                </Popup>
                <button
                  className="send_text_emoji_select_button"
                  onClick={() => {
                    console.log(textMessage);
                    let message;
                    if (isYes) {
                      message = "code_12974##" + textMessage;
                    } else {
                      message = textMessage;
                    }
                    sendText(currentChat, userData?.id, message);
                    setTextMessage("");
                    setIsYes(false);
                    checkChat(false);
                  }}
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="code_block_empty">
          <img src={img17} alt="image" />
          <h4>CodeChat here Human</h4>
          <p>
            Welcome to CodeChat – where coding meets connection! Easily chat,
            share, and discuss code with friends from anywhere. Your coding
            companionship, just a click away!
          </p>
        </div>
      )}
    </div>
  );
};
export default ChatBox;
