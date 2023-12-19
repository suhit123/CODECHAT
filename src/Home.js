import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import "./styles/Home.css";
import axios from "axios";
import Icon from "./helpers/Icons";
import { ChatContext } from "./context/chatContext";
import Chatblock from "./chat/Chatblock";
import ChatBox from "./chat/ChatBox";
import catrun from "./resources/cat_run.gif";
import img4 from "./resources/img4.png";
import img6 from "./resources/img6.png";
import img7 from "./resources/img7.jpg";
import img8 from "./resources/img8.png";
import img10 from "./resources/img10.png";
import logo1 from "./resources/logo1.png";
import logo2 from "./resources/logo2.png";
import logo3 from "./resources/logo3.png";
import logo4 from "./resources/logo4.png";
import logo5 from "./resources/logo5.png";
import logo6 from "./resources/logo6.png";
import logo7 from "./resources/logo7.png";
import logo8 from "./resources/logo8.png";
import {
  faHome,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { removeToken } from "./cookieUtils";
import Popup from "reactjs-popup";
const Home = () => {
  const { token, userData, loading } = useAuth();
  const [_token, setToken] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [popUpOf, setPopUpOf] = useState("");
  const [profileText,setProfileText]=useState('logo1');
  const {
    userChats,
    isUserChatsLoading,
    userChatsError,
    updateCurrentChat,
    createChat,
  } = useContext(ChatContext);
  const [secondId, setSecondId] = useState("");
  const handleHomeClick = () => {
    document.location.reload();
  };
  const handleSignOutClick = () => {
    removeToken();
    document.location.reload();
  };
  const closePopup = () => {
    setPopUp(false);
    setPopUpOf("");
  };
  const openPopupCreate = () => {
    setPopUp(true);
    setPopUpOf("create");
  };
  const openPopupProfile = () => {
    setPopUp(true);
    setPopUpOf("profile");
  };
  const openPopupSignout = () => {
    setPopUp(true);
    setPopUpOf("signout");
  };
  const handleCopyClick = async () => {
    const textToCopy = `${userData.id}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Text successfully copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy text to clipboard: ", err);
    }
  };
  const handleImageClick=(text)=>{
    setProfileText(text);
    console.log(text)
  }
  const handleChangeProfile=async()=>{
    await axios.post('http://localhost:4001/changeprofile',{id:userData.id,Profile:profileText})
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err)
    })
    document.location.reload()
  }
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="home_container">
          <div className="home_container1">
            <img className="home_container1_img" src={img6} alt="image" />
            <div className="icons_container1">
              <Icon
                icon={faHome}
                className="icon_container1"
                onClick={handleHomeClick}
              />
              <Icon
                icon={faUser}
                className="icon_container1"
                onClick={openPopupProfile}
              />
              <Icon
                icon={faSignOutAlt}
                className="icon_container1"
                onClick={openPopupSignout}
              />
            </div>
          </div>
          <div className="home_container2">
            <div className="home_container2_top">
              <h2>CodeChat</h2>
              <input type="text" placeholder="Search" />
              <button onClick={openPopupCreate}>+</button>
            </div>
            <div className="home_container2_bottom">
              {userChats ? (
                userChats.map((chat, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        updateCurrentChat(chat);
                      }}
                    >
                      <Chatblock chat={chat} user={userData} />
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="home_container3">
            <ChatBox />
          </div>
          <div className={`pop_up_create ${popUp ? "activate" : ""}`}>
            {popUpOf === "create" ? (
              <form onSubmit={(e) => { e.preventDefault();createChat(userData.id, secondId)}}>
                <input
                  type="text"
                  placeholder="Enter UserId"
                  name="secondId"
                  value={secondId}
                  onChange={(e) => {
                    setSecondId(e.target.value);
                  }}
                  required
                />
                <button type="submit">Add User</button>
              </form>
            ) : popUpOf === "profile" ? (
              <div className="profile_popup">
                <div className="profile_popup_logo_div">
                  <Popup 
                    trigger={
                      <button className="change_selector">Change</button>
                    }
                    contentStyle={{ width: "350px" }}
                    position="top right"
                  >
                    <div className="model_popup">
                      <div className="model_popup_">
                        <img src={logo1} alt="img" onClick={()=>handleImageClick('logo1')}/>
                        <img src={logo2} alt="img" onClick={()=>handleImageClick('logo2')}/>
                        <img src={logo3} alt="img" onClick={()=>handleImageClick('logo3')}/>
                        <img src={logo4} alt="img" onClick={()=>handleImageClick('logo4')}/>
                      </div>
                      <div className="model_popup_">
                        <img src={logo5} alt="img" onClick={()=>handleImageClick('logo5')}/>
                        <img src={logo6} alt="img" onClick={()=>handleImageClick('logo6')}/>
                        <img src={logo7} alt="img" onClick={()=>handleImageClick('logo7')}/>
                        <img src={logo8} alt="img" onClick={()=>handleImageClick('logo8')}/>
                      </div>
                      <div>
                      <p>Selected</p>
                        <img src={require(`./resources/${profileText}.png`)} alt='img'/>
                      </div>
                      <button onClick={handleChangeProfile}>Done</button>
                    </div>
                  </Popup>
                  <img
                    className="profile_popup_logo"
                    src={
                      require(`./resources/${userData.Profile}.png`) || logo1
                    }
                    alt="img"
                  />
                </div>
                <h3>Hello {userData.Name} 🤘</h3>
                <h1>{userData.id}</h1>
                <img
                  className="clipboard_png"
                  src={img10}
                  onClick={handleCopyClick}
                  alt="i"
                />
              </div>
            ) : popUpOf === "signout" ? (
              <div className="sign_out_popup">
                <p>Are you really want to Sign out?</p>
                <button onClick={handleSignOutClick}>Sign Out</button>
              </div>
            ) : (
              <></>
            )}
            <div>
              <img
                className="popup_side_image"
                src={
                  popUpOf === "create"
                    ? img4
                    : popUpOf === "signout"
                    ? img7
                    : img8
                }
                alt="image"
              />
            </div>
            <div>
              <button className="pop_up_create_close" onClick={closePopup}>
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
