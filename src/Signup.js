import "./styles/Signup.css";
import { useState } from "react";
import img from "./resources/img1.gif";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const handleContextMenu = (e) => {
    // e.preventDefault(); // Prevent the default context menu behavior
  };
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:4001/create`, formData)
      .then((res) => {
        console.log(res);
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.error === 1) {
          setError("Both Username and Email exist!");
        } else if (err?.response?.data?.error === 2) {
          setError("Username already exist!");
        } else if (err?.response?.data?.error === 3) {
          setError("Email already exist!");
        } else {
          setError("Something wrong!");
        }
      });
  };
  return (
    <div className="signup_entire_container" onContextMenu={handleContextMenu}>
      <div className="signup_left_container">
        <div className="signup_left_container_top">
          <div className="signup_logo">
            <h2>ChatKaro</h2>
          </div>
          <div className="signup_design">
            <div className="signup_design1"></div>
            <div className="signup_design2"></div>
          </div>
        </div>
        <form className="signup_form" onSubmit={handleSubmit}>
          <h2>Create your account now.</h2>
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
          <label>
            <p>Email</p>
            <input
              type="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </label>
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
          <div>
            <button type="submit">Sign Up</button>
            <Link to={"/login"}>Login</Link>
          </div>
        </form>
      </div>
      <div className="signup_right_container">
        <img src={img} className="signup_right_img" alt="image" />
      </div>
    </div>
  );
};
export default Signup;
