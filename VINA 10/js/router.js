import { changeProfile } from "./pages/mainpage.js";
import { authService } from "./firebase.js";

export const route = (event) => {
    event.preventDefault();
    window.location.hash = event.target.hash;
};


import { getPostingList } from "./pages/mainpage.js";
// 각 페이지 마다 연결

const routes = {
    "/": "/pages/mainpage.html",
    loginpage: "/pages/loginpage.html",
    404: "/pages/404.html",
    mainpage: "/pages/mainpage.html",
};

export const handleLocation = async () => {
    let path = window.location.hash.replace("#", ""); // ""

    // "http://example.com/"가 아니라 도메인 뒤에 / 없이 "http://example.com" 으로 나오는 경우
    if (path.length == 0) {
        path = "/";
    }
    const route = routes[path] || routes[404]; // truthy 하면 route[path], falsy 하면 routes[404]
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    // 로그인&로그아웃
    if (window.user) {
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "block";

        // 프로필 모달창 수정사항
        const openButton = document.getElementById("profile_BTN");
        const modal = document.querySelector(".modal");
        openButton.addEventListener("click", () => {
            modal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        });

        //모달 X버튼 닫기
        const modalExit = document.querySelector(".modalExit");
        modalExit.addEventListener("click", () => {
            modal.classList.add("hidden");
            document.body.style.overflow = "unset";
        });

        // 모달 cancel버튼 닫기
        const modalCancel = document.querySelector(".cancelBtn");
        modalCancel.addEventListener("click", () => {
            modal.classList.add("hidden");
            document.body.style.overflow = "unset";
        });

        // 게시물 페이지 모달
        const pageOpen = document.querySelector(".pageBTN");
        const pageOpen2 = document.querySelector(".pageBTN2");
        const pageModal = document.querySelector(".pageModal");
        const pageClose = document.querySelector(".pageExit");

        pageOpen2.addEventListener("click", () => {
            pageModal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        });
        pageOpen.addEventListener("click", () => {
            pageModal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        });
        pageClose.addEventListener("click", () => {
            pageModal.classList.add("hidden");
            document.body.style.overflow = "unset";
        });

        // 게시판 delete 버튼
        const pageDel = document.querySelector(".deleteBtn");
        const pageDesc = document.querySelector("#DESC");
        const pageTitle = document.querySelector(".title");
        pageDel.addEventListener("click", () => {
            pageTitle.value = "";
            pageDesc.value = "";
            modalImage.src = "";
            modalImage.style.width = "0";
            modalImage.style.height = "0";
        });
        // 게시판 이미지 업로드
        const modalImgInput = document.querySelector("#input-file");
        const modalImage = document.querySelector(".input-img");
        modalImgInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            const fileUrl = URL.createObjectURL(file);
            modalImage.src = fileUrl;
            // modalImage.style.width = '220px';
            // modalImage.style.height = '220px';
            // modalImage.style.backgroundSize = 'cover';
        });
    } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("logoutButton").style.display = "none";

        /*alert (로그인전 경고)*/
        const openButton = document.getElementById("profile_BTN");
        const pageOpen = document.querySelector(".pageBTN");
        const pageOpen2 = document.querySelector(".pageBTN2");

        openButton.addEventListener("click", () => {
            if (confirm("로그인하세요")) {
                window.location.hash = "#loginpage";
            }
        });

        pageOpen2.addEventListener("click", () => {
            if (confirm("로그인하세요")) {
                window.location.hash = "#loginpage";
            }
        });

        pageOpen.addEventListener("click", () => {
            if (confirm("로그인하세요")) {
                window.location.hash = "#loginpage";
            }
        });

        caches.delete(cacheName).then(() => { });
        // 로그인이 안된 상태
    }

    // 요소들 중에 login 버튼 < Header> 에 있는 것이 나타나고
    // 이후에 로그인 버튼애ㅔ서 요소를 가져와서 inner.html
    //로그인 했으면 로그아웃주고
    if (path === "mainpage") {
        // 로그인한 회원의 프로필사진과 닉네임을 화면에 표시해줌.
        document.getElementById("profileNickname").placeholder =
            authService.currentUser.displayName ?? "닉네임 없음";

        document.getElementById("welcome_nickname").textContent =
            authService.currentUser.displayName + "님" ?? "닉네임 없음";

        document.getElementById("profileView").src =
            authService.currentUser.photoURL ?? "../assets/blankProfile.webp";

        getPostingList();
    }
};
