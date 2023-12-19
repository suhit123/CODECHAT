import "./styles/ForgotPassword.css";
import { useState } from "react";
import img from "./resources/img3.gif";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import catrun from "./resources/cat_run.gif";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleContextMenu = (e) => {
    // e.preventDefault(); // Prevent the default context menu behavior
  };
  const [formData, setFormData] = useState({
    Email: "",
    OTP: "",
    NewPassword: "",
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
  const handleGetOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`http://localhost:4001/sendotp`, { Email: formData.Email })
      .then((res) => {
        console.log(res.data);
        setError("");
        setClicked(true);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.error === 1) {
          setError("User not found!");
        } else if (err?.response?.data?.error === 2) {
          setError("Internal server error!");
        } else if (err?.response?.data?.error === 3) {
          setError("OTP is wrong!");
        } else {
          setError("Something wrong!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    console.log("clicked");
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`http://localhost:4001/verifyotp`, formData)
      .then((res) => {
        console.log(res.data);
        setError("");
        document.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.error === 1) {
          setError("User not found!");
        } else if (err?.response?.data?.error === 2) {
          setError("Internal server error!");
        } else {
          setError("Something wrong!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="fp_entire_container" onContextMenu={handleContextMenu}>
      <div className="fp_left_container">
        <div className="fp_left_container_top">
          <div className="fp_logo">
            <h2>ChatKaro</h2>
          </div>
          <div className="fp_design">
            <div className="fp_design1"></div>
            <div className="fp_design2"></div>
          </div>
        </div>
        <div className="fp_form_slide">
          <div className={`fp_slider ${clicked ? "clicked" : ""}`}>
            <form className="fp_form" onSubmit={handleGetOTP}>
              <h2>Reset your password now.</h2>
              <label>
                <p>Email</p>
                <input
                  type="email"
                  name="Email"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <p>{error === "" ? <></> : <p>&#128533;{error}</p>}</p>
              <div>
                <button type="submit">
                  {loading ? (
                    <img className="catrun" src={catrun} alt="image" />
                  ) : (
                    <p style={{ margin: 0 }}>Request OTP</p>
                  )}
                </button>
              </div>
            </form>
            <form className="fp_form" onSubmit={handleChangePassword}>
              <h2>Reset your password now.</h2>
              <label>
                <p>OTP</p>
                <input
                  type="text"
                  name="OTP"
                  value={formData.OTP}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <label>
                <p>New Password</p>
                <input
                  type={showPassword ? "text" : "Password"}
                  name="NewPassword"
                  value={formData.NewPassword}
                  onChange={handleChange}
                  required
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
                <button type="submit">
                  {loading ? (
                    <img className="catrun" src={catrun} alt="image" />
                  ) : (
                    <p style={{ margin: 0 }}>Change Password</p>
                  )}
                </button>
                <a
                  onClick={() => {
                    setClicked(!clicked);
                  }}
                >
                  Back
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="fp_right_container">
        <img src={img} className="fp_right_img" alt="image" />
      </div>
    </div>
  );
};
export default ForgotPassword;
