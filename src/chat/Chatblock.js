import "../styles/chatsBlock.css";
import logo1 from "../resources/logo1.png";
import { useFetchRecipient } from "../hooks/fetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../context/chatContext";
const Chatblock = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const {onLineUsers,currentChat}=useContext(ChatContext)
  return (
    <div className={`chats_blocks ${currentChat?.members.includes(recipientUser?.id) ?'highlight_chat_block':''}`}>
      <div className="chats_block_img">
        <img src={recipientUser && recipientUser?.Profile?require(`../resources/${recipientUser?.Profile}.png`):logo1} alt="logo" />
      </div>
      <div className="chats_block_mid">
        <p>{recipientUser?.Name}</p>
        <p>Hey my name is suhit</p>
      </div>
      <div className="chats_block_last">
        <p>11:30 AM</p>
        {onLineUsers?.some((item)=>item?.userId===recipientUser?.id)?<div className="chats_block_person_status"></div>:<></>}
      </div>
    </div>
  );
};
export default Chatblock;
