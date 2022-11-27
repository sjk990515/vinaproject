import { authService, storageService } from "../firebase.js";
import {
    ref,
    uploadString,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    orderBy,
    query,
    getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService } from "../firebase.js";

// %%%%%%%%%%%%%%%%%%%%%%%%%프로필 수정 기능%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export const changeProfile = async (event) => {
    event.preventDefault();
    document.getElementById("profileBtn").disabled = true;
    const imgRef = ref(
        storageService,
        `${authService.currentUser.uid}/${uuidv4()}`
    );

    const newNickname = document.getElementById("profileNickname").value;
    // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
    const imgDataUrl = localStorage.getItem("imgDataUrl");
    let downloadUrl;
    if (imgDataUrl) {
        const response = await uploadString(imgRef, imgDataUrl, "data_url");
        downloadUrl = await getDownloadURL(response.ref);
    }
    await updateProfile(authService.currentUser, {
        displayName: newNickname ? newNickname : null,
        photoURL: downloadUrl ? downloadUrl : null,
    })
        .then(() => {
            alert("프로필 수정 완료");
            window.location.hash = "#mainpage";
        })
        .catch((error) => {
            alert("프로필 수정 실패");
            console.log("error:", error);
        });
    // 프로필 사진 수정 저장
    const imgChange = document.querySelector("#imgInput");
    const image = document.querySelector("#profileView");
    imgChange.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        image.src = fileUrl;
        image.style.backgroundSize = "cover";
    });
};
export const onFileChange = (event) => {
    const theFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
        const imgDataUrl = finishedEvent.currentTarget.result;
        localStorage.setItem("imgDataUrl", imgDataUrl);
        document.getElementById("profileView").src = imgDataUrl;
    };
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%게시글 CRUD 기능%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export const save_comment = async (event) => {
    event.preventDefault();
    const DESC = document.getElementById("DESC");
    const postingTitle = document.getElementById("postingTitle");
    const pageImg = document.getElementById("pageImg").src;
    const { uid, photoURL, displayName } = authService.currentUser;
    try {
        await addDoc(collection(dbService, "DESC"), {
            postingTitle: postingTitle.value,
            text: DESC.value,
            createdAt: Date.now(),
            creatorId: uid,
            profile: photoURL,
            pageImg: pageImg,
            nickname: displayName,
        });
        alert("게시물 저장 완료!");
        DESC.value = "";
        postingTitle.value = "";
        // location.reload();
        // CacheStorage.delete(pageImg)
        // caches.delete(input-file);
        getPostingList();
        window.location.replace("#mainpage");
    } catch (error) {
        alert(error);
        console.log("error in addDoc:", error);
    }
};

export const onEditing = (event) => {
    // 수정버튼 클릭
    event.preventDefault();
    const udBtns = document.querySelectorAll(".editBtn");
    udBtns.forEach((udBtn) => (udBtn.disabled = "true"));
    const cardBody = event.target.parentNode.parentNode;
    
    const commentText = cardBody.children[0].children[0];
    const commentInputP = cardBody.children[0].children[1];
    commentText.classList.add("noDisplay");
    commentInputP.classList.add("d-flex");
    commentInputP.classList.remove("noDisplay");
    commentInputP.children[0].focus();
};

export const update_comment = async (event) => {
    event.preventDefault();
    const newComment = event.target.parentNode.children[0].value;
    const id = event.target.parentNode.id;
    const parentNode = event.target.parentNode.parentNode;
    const commentText = parentNode.children[0];
    commentText.classList.remove("noDisplay");
    const commentInputP = parentNode.children[1];
    commentInputP.classList.remove("d-flex");
    commentInputP.classList.add("noDisplay");
    const commentRef = doc(dbService, "DESC", id);
    try {
        await updateDoc(commentRef, { text: newComment });
        getPostingList();
    } catch (error) {
        alert(error);
    }
};
export const delete_comment = async (event) => {
    event.preventDefault();
    const id = event.target.name;
    const ok = window.confirm("해당 게시물을 정말 삭제하시겠습니까?");
    if (ok) {
        try {
            await deleteDoc(doc(dbService, "DESC", id));
            getPostingList();
        } catch (error) {
            alert(error);
        }
    }
};

export const getPostingList = async () => {
    let cmtObjList = [];
    const q = query(
        collection(dbService, "DESC"),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const commentObj = {
            id: doc.id,
            ...doc.data(),
        };
        cmtObjList.push(commentObj);
    });
    const postingList = document.getElementById("posting-list"); //comment-list or commnet-list
    const currentUid = authService.currentUser.uid;
    postingList.innerHTML = "";
    cmtObjList.forEach((cmtObj) => {
        const isOwner = currentUid === cmtObj.creatorId;
        const temp_html = `
                <span ><img id ="pageImg-${cmtObj.id}" class="cardImage" src="${
            cmtObj.pageImg ?? null
        }" onerror="this.style.display='none';"></span>
                <h3 id = "postingTitle-${
                    cmtObj.id
                }">${cmtObj.postingTitle.substring(0, 11)}</h3>
                <p id = "postingDescription-${
                    cmtObj.id
                }">${cmtObj.text.substring(0, 90)}</p>
                <div>
                    <h4><span></span>${
                        cmtObj.nickname ?? "닉네임 없음"
                    }</h4>                        
                    <button id="delete_btn" name="${
                        cmtObj.id
                    }" onclick="delete_comment(event)" class="${
            isOwner ? "deleteBtn" : "noDisplay"
        }">삭제</button>
                    </div> 
                </div>
            `;

        const div = document.createElement("div");
        div.classList.add("main_box");
        div.addEventListener("click", ModalOpenOnMainPage);
        div.innerHTML = temp_html;
        div.id = cmtObj.id;
        postingList.appendChild(div);

        // 삭제 시 모달 안뜨게
        const delete_btn = document.querySelectorAll("#delete_btn");
        for (let i = 0; i < delete_btn.length; i++) {
            delete_btn[i].addEventListener('click', () => {
                div.removeEventListener("click", ModalOpenOnMainPage);
            });
        }
    });
};

//게시물 이미지 업로드
export const onPageImgChange = (event) => {
    const theFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
        const pageImgDataUrl = finishedEvent.currentTarget.result;
        localStorage.setItem("pageImgDataUrl", pageImgDataUrl);
        document.getElementById("pageImg").src = pageImgDataUrl;
    };
};

