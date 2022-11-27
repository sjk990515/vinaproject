import { authService } from "./firebase.js";
import { handleLocation, loginBefore } from "./router.js";
import { handleAuth, onToggle, logout } from "./pages/loginpage.js";
import {
    changeProfile,
    onFileChange,
    onPageImgChange,
} from "./pages/mainpage.js";
import { socialLogin } from "./pages/loginpage.js";
import {
    save_comment,
    update_comment,
    onEditing,
    delete_comment,
} from "./pages/mainpage.js";
window.addEventListener("hashchange", loginBefore);
document.addEventListener("DOMContentLoaded", loginBefore);
loginBefore();
window.addEventListener("hashchange", handleLocation);
document.addEventListener("DOMContentLoaded", handleLocation);
authService.onAuthStateChanged((user) => {
    handleLocation();
    const hash = window.location.hash;
    if (user) {
        if (hash === "") {
            window.location.replace("#mainpage");
        }
    } else {
        if (hash !== "") {
            window.location.replace("");
        }
    }
});

// 전역 함수 리스트
window.toggleSearch = toggleSearch;
window.animateLabel = animateLabel;
window.toggleopenClose = toggleopenClose;
window.nightsun = nightsun;
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.socialLogin = socialLogin;
window.logout = logout;
window.onFileChange = onFileChange;
window.changeProfile = changeProfile;
window.save_comment = save_comment;
window.update_comment = update_comment;
window.onEditing = onEditing;
window.delete_comment = delete_comment;
window.ModalOpenOnMainPage = ModalOpenOnMainPage;
window.onPageImgChange = onPageImgChange;

// window.goToProfile = goToProfile;
// window.route = route;

//토글 메뉴
function toggleopenClose() {
    if (document.getElementById("main_toggle_text").style.display === "block") {
        document.getElementById("main_toggle_text").style.display = "none";
        //   document.getElementById('main_text').textContent = '보이기';
    } else {
        document.getElementById("main_toggle_text").style.display = "block";
        //   document.getElementById('toc-toggle').textContent = '숨기기';
    }
}

//다크모드
function nightsun(event) {
    const delete_btn = document.querySelectorAll("#delete_btn");
    const google_icon = document.querySelectorAll(".material-icons");
    const Main_menu = document.querySelectorAll(".main_menu div");
    const hamburger = document.querySelectorAll(".main_menu > ul li ");
    const main_content = document.querySelectorAll(".main_content > div div ");
    const main_box = document.querySelectorAll(".main_box ");
    const main_box_title = document.querySelectorAll(
        ".main_box h3, .main_box h4, .main_box p"
    );
    const main_box_line = document.querySelectorAll(".main_box div");
    const main_toggle = document.querySelectorAll(".main_menu > span div p");
    const footerName = document.querySelectorAll(".footer ul li h4 a");
    const footerTitle = document.querySelectorAll(
        ".footer > .footer-box > li h3"
    );
    const footerAbout = document.querySelectorAll(
        ".footer > .footer-box > li p"
    );
    const footerLine = document.querySelectorAll(".footer > .footer-box");

    if (document.getElementById("moon").style.display === "block") {
        document.getElementById("wrap").style.background = "#000";
        document.getElementById("moon").style.display = "none";
        document.getElementById("sun").style.display = "block";
        document.getElementById("header").style.background = "#343a40";
        document.getElementById("main_search").style.background = "#343a40";
        document.getElementById("footer").style.background = "#343a40";
        document.getElementById("welcome_nickname").style.color = "#fff";
        document.querySelector(".main_logo").style.color = "#fff";
        document.querySelector(".menu_active").style.border = "1px solid #fff";
        document.querySelector(".main_menu > span > p").style.background =
            "#727272";
        document.querySelector(".main_menu > span > p").style.color = "#fff";
        document.querySelector(".footer > .footer-box2 > li > h1").style.color =
            "#fff";
        document.querySelector(
            ".main_menu > div .dropdown_content"
        ).style.background = "#000";
        document.querySelector(".search_input").style.color = "#fff";

        for (var i = 0; i < delete_btn.length; i++) {
            delete_btn[i].style.color = "#fff";
        }

        for (var i = 0; i < google_icon.length; i++) {
            google_icon[i].style.color = "#fff";
        }

        for (var i = 0; i < Main_menu.length; i++) {
            Main_menu[i].style.color = "#fff";
        }

        for (var i = 0; i < hamburger.length; i++) {
            hamburger[i].style.background = "#fff";
        }

        for (var i = 0; i < main_content.length; i++) {
            main_content[i].style.background = "#121212";
            main_content[i].style.boxShadow = "0 0 0 0";
            main_content[i].style.border = "1px solid #727272";
        }

        for (var i = 0; i < main_box_title.length; i++) {
            main_box_title[i].style.color = "#fff";
        }

        for (var i = 0; i < main_box_line.length; i++) {
            main_box_line[i].style.borderTop = "1px solid #ccc";
        }

        for (var i = 0; i < main_toggle.length; i++) {
            main_toggle[i].style.background = "#121212";
            main_toggle[i].style.color = "#fff";
        }

        for (var i = 0; i < footerName.length; i++) {
            footerName[i].style.color = "#fff";
        }

        for (var i = 0; i < footerTitle.length; i++) {
            footerTitle[i].style.color = "#fff";
        }

        for (var i = 0; i < footerAbout.length; i++) {
            footerAbout[i].style.color = "#fff";
        }

        for (var i = 0; i < footerLine.length; i++) {
            footerLine[i].style.borderBottom = "1px solid #fff";
        }
    } else {
        document.getElementById("wrap").style.background = "#fff";
        document.getElementById("sun").style.display = "none";
        document.getElementById("moon").style.display = "block";
        document.getElementById("header").style.background = "#ffeae4";
        document.getElementById("main_search").style.background = "#ffeae4";
        document.getElementById("footer").style.background = "#ffeae4";
        document.getElementById("welcome_nickname").style.color = "#000";
        document.querySelector(".main_logo").style.color = "#000";
        document.querySelector(".menu_active").style.border = "1px solid #000";
        document.querySelector(".main_menu > span > p").style.background =
            "#ffeae4";
        document.querySelector(".main_menu > span > p").style.color = "#000";
        document.querySelector(".footer > .footer-box2 > li > h1").style.color =
            "#000";
        document.querySelector(
            ".main_menu > div .dropdown_content"
        ).style.background = "#fff";
        document.querySelector(".search_input").style.color = "#000";

        for (var i = 0; i < delete_btn.length; i++) {
            delete_btn[i].style.color = "#000";
        }

        for (var i = 0; i < google_icon.length; i++) {
            google_icon[i].style.color = "#000";
        }

        for (var i = 0; i < Main_menu.length; i++) {
            Main_menu[i].style.color = "#000";
        }

        for (var i = 0; i < hamburger.length; i++) {
            hamburger[i].style.background = "#000";
        }

        for (var i = 0; i < main_content.length; i++) {
            main_content[i].style.background = "#fff";
            main_content[i].style.boxShadow = "3px 4px 15px 3px #ccc";
            main_content[i].style.border = "0";
        }
        for (var i = 0; i < main_box_title.length; i++) {
            main_box_title[i].style.color = "#000";
        }

        for (var i = 0; i < main_box_line.length; i++) {
            main_box_line[i].style.borderTop = "1px solid #000";
        }

        for (var i = 0; i < main_toggle.length; i++) {
            main_toggle[i].style.background = "#fff";
            main_toggle[i].style.color = "#000";
        }

        for (var i = 0; i < footerName.length; i++) {
            footerName[i].style.color = "#000";
        }

        for (var i = 0; i < footerTitle.length; i++) {
            footerTitle[i].style.color = "#000";
        }

        for (var i = 0; i < footerAbout.length; i++) {
            footerAbout[i].style.color = "#000";
        }

        for (var i = 0; i < footerLine.length; i++) {
            footerLine[i].style.borderBottom = "1px solid #000";
        }
    }
}

// 검색창 토글 버튼
function toggleSearch() {
    const NAVSearch = document.querySelector(".NAVSearch");
    const NAVSearchBTN = document.querySelector(".NAVSearchBTN");
    const input = document.querySelector(".input");
    NAVSearch.classList.toggle("active");
    input.focus();
}

// 로그인 화면 글자 움직이는 효과
function animateLabel() {
    const labels = document.querySelectorAll(".form-control label");

    labels.forEach((label) => {
        label.innerHTML = label.innerText
            .split("")
            .map(
                (letter, idx) =>
                    `<span style="transition-delay:${
                        idx * 20
                    }ms">${letter}</span>`
            )
            .join("");
    });
}

//모달창 오픈

function ModalOpenOnMainPage(event) {
    console.log(event);
    console.log(event.currentTarget);
    console.log(event.currentTarget.id);
    const cardModalJieun = document.getElementById("cardModal_jieun");
    const Ptitle = document.querySelector(
        `#postingTitle-${event.currentTarget.id}`
    );
    const Pdescription = document.querySelector(
        `#postingDescription-${event.currentTarget.id}`
    );
    const Pphoto = document.querySelector(`#pageImg-${event.currentTarget.id}`);
    console.log(Pphoto);
    cardModalJieun.innerHTML = "";
    // const currentUid = authService.currentUser.uid;
    // const isOwner = currentUid === event.currentTarget.id;
    // console.log(isOwner);
    const Ptemp_html = ` 
<div class="cardModal" data-backdrop="static"> 
    <div class ="cardModal_overlay">
        <div class="postWrap">
            <div class="editContainer">
                <div class="editPage">
                    <button class="cardModalExit">&#128473;</button>
                    <div class="postTitle">
                        <textarea id="postingTitle" placeholder="제목을 입력하세요.">${Ptitle.textContent}</textarea>
                    </div>
                    <b class="text_line"></b>
                    <label class="image-file-button" for="input-file">
                        <span class="material-icons">image</span>
                        <img src="${Pphoto.src}" alt="" class="input-img" />
                    </label>
                    <input onchange="onPageImgChange(event)" type="file" id="input-file" style="display: none"
                        accept="image/*" /><br />

                    <div class="PAGE">
                        <textarea id="DESC" cols="30" rows="20" placeholder="내용을 입력해주세요.">${Pdescription.textContent}</textarea>                        
                    </div>
                </div>                
                <div class="Edit_Delete_btn">
                    <button onclick="save_comment(event)" type="button" class="saveBtn">
                        Save
                    </button>
                    <button onclick="onEditing(event)" class="editBtn">
                        Edit
                    </button>
                    <button  onclick="delete_comment(event)" class="deleteBtn">
                        Delete
                    </button>
                </div>                
            </div>
        </div>
    </div>
</div>
`;
    const div12 = document.createElement("div");
    div12.innerHTML = Ptemp_html;
    console.log(cardModalJieun);
    cardModalJieun.appendChild(div12);

    const cardModalOpen = document.querySelectorAll(".main_box");
    const cardModal = document.querySelector(".cardModal");
    const cardModalClose = document.querySelector(".cardModalExit");

    for (let i = 0; i < cardModalOpen.length; i++) {
        cardModalOpen[i].addEventListener("click", () => {
            cardModal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        });
    }
    cardModalClose.addEventListener("click", () => {
        cardModal.classList.add("hidden");
        document.body.style.overflow = "unset";
    });
}
