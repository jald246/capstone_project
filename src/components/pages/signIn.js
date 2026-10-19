import React, { useContext } from "react";
import { authContext } from "./auth-context";
import { FcGoogle } from "react-icons/fc";
import './signIn.css';

function SignIn() {
  const { googleLoginHandler } = useContext(authContext);

  return (
    <div className="signin-page-canvas">
      <div className="signin-card-shell text-center">
        
        <h1 className="signin-main-title">
          Welcome!
        </h1>
        
        <p className="signin-sub-title">
          Inventory Manager Dashboard
        </p>

        <hr className="my-4 text-muted" style={{ opacity: 0.15 }} />

        <h4 className="fs-5 fw-bold text-dark mb-4">
          Please log in to show your catalog
        </h4>

        <button
          onClick={googleLoginHandler}
          className="btn-google-login"
        >
          <FcGoogle style={{ fontSize: '1.4rem' }} />
          <span>Continue with Google</span>
        </button>
        
      </div>
    </div>
  );
}

export default SignIn;
