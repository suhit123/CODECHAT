import "./styles/Login.css";
import { useState } from "react";
import img from "./resources/img2.gif";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const handleContextMenu = (e) => {
    // e.preventDefault(); // Prevent the default context menu behavior
  };
  const [formData, setFormData] = useState({
    Name: "",
    Password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const setcookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:4001/login`, formData)
      .then((res) => {
        console.log(res);
        setcookie("Authentication", res.data.token, 1);
        document.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.error === 1) {
          setError("Username not registered!");
        } else if (err?.response?.data?.error === 2) {
          setError("Incorrect password!");
        } else if (err?.response?.data?.error === 3) {
          setError("Enter both the fields!");
        } else {
          setError("Something wrong!");
        }
      });
  };
  return (
    <div className="entire_container" onContextMenu={handleContextMenu}>
      <div className="left_container">
        <div className="left_container_top">
          <div className="logo">
            <h2>ChatKaro</h2>
          </div>
          <div className="design">
            <div className="design1"></div>
            <div className="design2"></div>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <h2>Login into your account now.</h2>
          <label>
            <p>Username</p>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </label>
          <br />
          <br />
          <label>
            <p>Password</p>
            <input
              type={showPassword ? "text" : "Password"}
              name="Password"
              value={formData.Password}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleCheckboxChange}
            />
            Show Password
          </label>
          <br />
          <p>{error === "" ? <></> : <p>&#128533;{error}</p>}</p>
          <Link style={{ margin: 0 }} to={"/forgotpassword"}>
            forgotpassword?
          </Link>
          <div>
            <button type="submit">Log in</button>
            <Link to={"/Signup"}>Signup</Link>
          </div>
        </form>
      </div>
      <div className="right_container">
        <img src={img} className="right_img" alt="image" />
      </div>
    </div>
  );
};
export default Login;
