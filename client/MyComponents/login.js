import React, { useState, useRef } from "react";
import { db } from './config/firebase'
//import { str } from './config/firebase'
import { auth } from './config/firebase'
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import './login.css';
import { getDocs, query, where, collection } from "firebase/firestore";
export default function Login() {

  document.title = 'RoadXamine-Login';
  //console.log(auth?.currentUser?.email)//throws error if we doesn't keep ? if one of the object is not present...
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loginStatus, setLoginStatus] = useState("")

  const navigate = useNavigate();

  const inputRef = useRef(null)

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password)
      getOfficerName()
    } catch (err) {
      setLoginStatus("*Enter correct email and password")
    }
  }

  const getOfficerName = async () => {
    const OfficerCollectionRef = collection(db, "Officer");
    const q = query(OfficerCollectionRef, where("Email", "==", auth.currentUser.email));
    try {
      const data = await getDocs(q);
      if (data.size === 1) {
        const doc = data.docs[0];
        navigate('/dashboard/' + doc.data().Name)
      }
    } catch (err) {

    }
  }

  const [resetPassword, setResetPassoword] = useState("")
  const reset = async () => {
    try {
      await sendPasswordResetEmail(auth, username);
      setResetPassoword("mail sent");
    } catch (err) {
      setResetPassoword("Try again with valid details");
    }

  }

  return (
    <div>
      <div className="login">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.carbaba.co.uk%2Fblog%2Fwp-content%2Fuploads%2F2016%2F01%2FNight-Driving-CarBaba-3.jpg&f=1&nofb=1&ipt=55c85ac73ca7ebea96b096d2a0c0582c58576170fe58e7cd92f06841f53b7026&ipo=images" alt="#"
        />
        <div className="login-details">
          <h1>Login</h1>
          <p>Login with your details</p>
          <form onSubmit={login}>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={inputRef}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button onClick={reset} id="reset">
              Reset Passoword
            </button>
            <button id="login" type="submit">
              Login
            </button>
            <p className="login_status">{loginStatus}</p>
          </form>
          <p>{resetPassword}</p>
        </div>
      </div>
    </div>
  )
}
