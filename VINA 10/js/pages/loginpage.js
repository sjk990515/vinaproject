
// 아이디 만들기

export const SUuserName = document.querySelector('.SUuserName');
export const email = document.querySelector('.email');
export const password = document.querySelector('.password');
export const confirm = document.querySelector('.confirm');
export const signUpBtn = document.querySelector('#signUpBtn');
export const SUconfirmpassword = document.querySelector('.SUconfirmpassword');

// import { authService, storageService } from "../firebase.js";
// import {
//     ref,
//     uploadString,
//     getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
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
    // const SUemail = document.getElementById("SUemail");
    // const SUemailVal = SUemail.value;
    // const SUpassword = document.getElementById("SUpassword");
    // const SUpasswordVal = SUpassword.value;
    // const SUusername = document.getElementById("SUusername");
    // const SUusernameVal = SUusername.value;
    // const SUconfirmpassword = document.getElementById("SUconfirmpassword");
    // const SUconfirmpasswordVal = SUconfirmpassword.value;

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
    // if (!confirmpasswordVal) {
    //     alert("같은 비밀번호를 입력해 주세요");
    //     confirmpassword.focus();
    //     return;
    // }
    // if (!usernameVal) {
    //     alert("유저명을 입력해 주세요");
    //     username.focus();
    //     return;
    // }

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

    //두개의 버튼이 Form 으로 감싸져 있고, Form에 Summit Event 가 발생했을 떄, 
    //발생한 Event 객체가 넘어오고
    // Submit 이벤트 // submitter << 정확히 어떤 객체를 불러오는지 확인 

    // if (event.submitter.id === "signUpBtn") {
    if (event.submitter.id === "signInBtn") {
        // 유효성검사 후 로그인 성공 시 팬명록 화면으로

        signInWithEmailAndPassword(authService, emailVal, passwordVal)
            .then((userCredential) => {
                console.log(userCredential)
                // Signed in
                const user = userCredential.user;
                window.location.hash = "#mainpage";

                // 로그인시 유저 정보가 user 로 저장 
                window.user = user;

                //윈도우라는 객체는 전역 객체로서 브라우저 각각의 특성에 따라 
                //조금씩 다르게 작동할 수 있고, 
                //window 객체가 워낙 많아 객체가 덮어씌워져 Critical Issue 가 생길 수 있고
                // 어지간하면 지양하는게 좋다. 
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



    // 
    if (event.submitter.id === "signUpBtn") {
        // 회원가입 버튼 클릭의 경우
        createUserWithEmailAndPassword(authService, emailVal, passwordVal)
            .then((userCredential) => {
                // Signed in
                console.log("회원가입 성공!");
                // const user = userCredential.user;

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
            // Sign-out successful.
            localStorage.clear();
            console.log("로그아웃 성공");

            // 진양님 가르침 
            document.querySelector('#logout').innerText = 'login'
            window.location.hash = "#mainpage";
        })
        .catch((error) => {
            // An error happened.
            console.log("error:", error);
        });
};