export const SUuserName = document.querySelector('.SUuserName');
export const email = document.querySelector('.email');
export const password = document.querySelector('.password');
export const confirm = document.querySelector('.confirm');
export const signUpBtn = document.querySelector('#signUpBtn');
export const SUconfirmpassword = document.querySelector('.SUconfirmpassword');

import { emailRegex, passwordRegex } from "../util.js";
import { authService } from "../firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
export const handleAuth = (event) => {
    console.log(event);
    console.log(event.target);
    console.log(event.submitter.id)
    event.preventDefault();
    const email = document.getElementById("SIemail");
    const emailVal = email.value;
    const password = document.getElementById("SIpassword");
    const passwordVal = password.value;

    // 유효성 검사 진행
    if (!emailVal) {
        alert("이메일을 입력해 주세요");
        email.focus();
        return;
    }
    if (!passwordVal) {
        alert("비밀번호를 입력해 주세요");
        password.focus();
        return;
    }

    const matchedEmail = emailVal.match(emailRegex);
    const matchedpassword = passwordVal.match(passwordRegex);

    if (matchedEmail === null) {
        alert("이메일 형식에 맞게 입력해 주세요");
        email.focus();
        return;
    }
    if (matchedpassword === null) {
        alert("비밀번호는 8자리 이상 영문자, 숫자, 특수문자 조합이어야 합니다.");
        password.focus();
        return;
    }

    // 유효성 검사 통과 후 로그인 또는 회원가입 API 요청
    const signUpBtnText = document.querySelector("#signUpBtn").value;
    const signInBtnText = document.querySelector("#signInBtn").value;
    if (event.submitter.id === "signInBtn") {
        signInWithEmailAndPassword(authService, emailVal, passwordVal)
            .then((userCredential) => {
                console.log(userCredential)
                // Signed in
                const user = userCredential.user;
                window.location.hash = "#mainpage";
                window.user = user;
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log("errorMessage:", errorMessage);
                if (errorMessage.includes("user-not-found")) {
                    alert("가입되지 않은 회원입니다.");
                    return;
                } else if (errorMessage.includes("wrong-password")) {
                    alert("비밀번호가 잘못 되었습니다.");
                }
            });
        return;
    }
    if (event.submitter.id === "signUpBtn") {
        createUserWithEmailAndPassword(authService, emailVal, passwordVal)
            .then((userCredential) => {
                console.log("회원가입 성공!");
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log("errorMessage:", errorMessage);
                if (errorMessage.includes("email-already-in-use")) {
                    alert("이미 가입된 이메일입니다.");
                }
            });
        return;
    }
};

// 로그인, 회원가입 화면 토글링 기능
export const onToggle = () => {
    const signUpBtn = document.querySelector("#signUpBtn");
    const authToggle = document.querySelector("#authToggle");
    const authTitle = document.querySelector("#authTitle");
    if (signUpBtn.value === "로그인") {
        signUpBtn.value = "회원가입";
        authToggle.textContent = "로그인 화면으로";
        authTitle.textContent = "회원가입 페이지";
    } else {
        signUpBtn.value = "로그인";
        authToggle.textContent = "회원가입 화면으로";
        authTitle.textContent = "로그인 페이지";
    }
};
export const socialLogin = (event) => {
    const { name } = event.target;
    let provider;
    if (name === "google") {
        provider = new GoogleAuthProvider();
    } else if (name === "github") {
        provider = new GithubAuthProvider();
    }
    signInWithPopup(authService, provider)
        .then((result) => {
            const user = result.user;
        })
        .catch((error) => {
            // Handle Errors here.
            console.log("error:", error);
            const errorCode = error.code;
            const errorMessage = error.message;
        });
};
export const logout = () => {
    signOut(authService)
        .then(() => {
            localStorage.clear();
            console.log("로그아웃 성공");
            document.querySelector('#logout').innerText = 'login'
            window.location.hash = "#mainpage";
        })
        .catch((error) => {
            console.log("error:", error);
        });
};