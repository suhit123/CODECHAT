import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import {io} from 'socket.io-client'
export const ChatContext = createContext();
export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(null);
  const [userChatError, setUserChatError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [socket,setSocket]=useState(null);
  const [onLineUsers,setOnLineUsers]=useState(null);
  const [newMessage,setNewMessage]=useState(null);
  const [newUserChat,setNewUserChat]=useState(null);
  const [istyping,setIstyping]=useState(false);
  const [isOthertyping,setIsOthertyping]=useState(null);
  useEffect(() => {
    const fetch = async () => {
      setIsUserChatsLoading(true);
      await axios
        .get(`http://localhost:4001/chat/${user.id}`)
        .then((res) => {
          setUserChats(res.data);
        })
        .catch((err) => {
          setUserChatError(err);
        })
        .finally(() => {
          setIsUserChatsLoading(false);
        });
    };
    if (user) {
      fetch();
    }
  }, [user]);
  useEffect(()=>{
    const newsocket=io('http://localhost:4000')
    setSocket(newsocket)
    return()=>{
        newsocket.disconnect()
    }
  },[user])
  useEffect(()=>{
    if(socket===null || user?.id===null) return
    socket.emit('newUserAdd',user?.id);
    socket.on('getOnlineUsers',(res)=>{
        setOnLineUsers(res)
    })
  },[socket])
  useEffect(()=>{
    if(socket===null) return
    socket.on("getMessage",(res)=>{
      if(currentChat?._id!==res.chatId) return;
      setMessages((prev)=>[...prev,res])
    });
    return()=>{
      socket.off("getMessage")
    } 
  },[socket,currentChat])
  useEffect(()=>{
    if(socket===null) return
    const recipientId=currentChat?.members?.find((id)=>id!==user?.id);
    socket.emit("sendMessage",{...newMessage,recipientId});
  },[newMessage])
  useEffect(()=>{
    if(socket===null) return
    socket.emit('sendUserAdded',newUserChat);
    console.log("sended")
  },[newUserChat])
  useEffect(()=>{
    if(socket===null) return
    socket.on("getUserAdded",(res)=>{
      if(!res?.added){
      setUserChats((prev)=>[...prev,res]);
      }
    })
    return()=>{
      socket.off("userAdded");
    }
  },[socket])
  useEffect(()=>{
    if(socket===null) return
    const recipientId=currentChat?.members?.find((id)=>id!==user?.id);
    socket.emit('userTyping',{istyping,recipientId,currentId:user.id});
  },[istyping])
  useEffect(()=>{
    if(socket===null) return
    socket.on("isTyping",(res)=>{
      setIsOthertyping(res);
      console.log(res.istyping)
    })
    return()=>{
      socket.off("isTyping");
    }
  },[socket])
  useEffect(() => {
    const fetch = async () => {
      setIsMessagesLoading(true);
      await axios
        .get(`http://localhost:4001/messages/${currentChat._id}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {
          setMessagesError(err);
        })
        .finally(() => {
          setIsMessagesLoading(false);
        });
    };
    if (currentChat !== null) {
      fetch();
    }
  }, [currentChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);
  const checkChat=useCallback(async(val)=>{
    setIstyping(val);
  },[])
  const createChat = useCallback(async (firstId, secondId) => {
    await axios
      .post(`http://localhost:4001/chat`, {
        firstId: firstId,
        secondId: secondId,
      })
      .then((res) => {
        if(!res?.data?.added){
        setUserChats((prev) => [...prev, res.data]);
        }
        setNewUserChat({...res.data,secondId});
        console.log(newUserChat);
      })
      .catch((err) => {
        console.log("Something wrong!");
      });
  }, []);
  const sendText=useCallback(async(currentChat,senderId,textMessage)=>{
    console.log(textMessage)
    try{await axios
    .post(`http://localhost:4001/messages`, {
      chatId: currentChat?._id,
      senderId: senderId,
      text:textMessage
    })
    .then((res) => {
      setMessages((prev)=>[...prev,res.data])
      setNewMessage(res.data);
    })
    .catch((err) => {
      console.log("Something wrong!");
    });}
    catch(err){
        console.log(err)
    }
  },[])
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatError,
        updateCurrentChat,
        createChat,
        sendText,
        checkChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        onLineUsers,
        isOthertyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
