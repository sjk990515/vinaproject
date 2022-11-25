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
    // const imgDataUrl = await uploadString(
    //     imgRef,
    //     document.getElementById("profileImg").src,
    //     "data_url"
    // ).then((snapshot) => {
    //     return getDownloadURL(snapshot.ref);
    // });
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
            // firebase.storage().ref('users/' + authService.user.uid + '/profile.jpg').put(file).then(function () {
            //     console.log('이미지 업로드 성공')
            // }).catch(error => {
            //     console.log('이미지 업로드 실패')
            // })
            //     const user = authService.currentUser;
            //     user.updateProfile({
            //         displayName: newNickname ? newNickname : null,
            //         photoURL: downloadUrl ? downloadUrl : null,
            //     }).then(() => {
            //         console.log("프로필 업데이트 성공");
            //         document.getElementById("profileBtn").disabled = false;
            //         document.getElementById("profileModal").style.display = "none";
            //         document.getElementById("profileNickname").value = "";
            //         document.getElementById("profileImg").src = "";
            //         localStorage.removeItem("imgDataUrl");
            //     });
            // })
            // .catch((error) => {
            //     console.log("프로필 업데이트 실패");
            //     console.log(error);
            // });

            //const fileRef = storageRef.ref(`users/${authService.currentUser.uid}/profile.jpg`);
            // make this code work with firebase storage

            // 위 코드를 참졸해서 firebase storage에 이미지를 업로드 해보자.
            // const file = document.getElementById("imgInput").files[0];
            // const storageRef = ref(storageService, `${authService.currentUser.uid}/${uuidv4()}`)
            // // storageService.ref(); is not a function, resove this error
            // const fileRef = storageRef
            // fileRef.put(file).then(function () {
            //     console.log('이미지 업로드 성공')
            // }).catch(error => {
            //     console.log('이미지 업로드 실패')
            // })

            alert("프로필 수정 완료");
            window.location.hash = "#mainpage";
        })
        .catch((error) => {
            alert("프로필 수정 실패");
            console.log("error:", error);
        });

    // const newName = document.getElementById("profileNickname");
    // let newNameNum = 0;
    // const newNameVal = newName.addEventListener("input", (event) => {
    //     newNameNum += event.target.value.length;
    //     console.log(event.target.value.length);
    // });

    // const modalSave = document.querySelector(".saveBtn");
    // modalSave.addEventListener("click", () => {
    //     if (newNameNum !== 0) {
    //         alert("수정완료");
    //         modal.classList.add("hidden");

    //     } else if (newNameNum === 0) {
    //         alert("이름을 입력해주세요");
    //     }
    // });

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
    const theFile = event.target.files[0]; // file 객체
    const reader = new FileReader();
    reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
    reader.onloadend = (finishedEvent) => {
        // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
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
        DESC.value = "";
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
    const udBtns = document.querySelectorAll(".editBtn, .deleteBtn");
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
    const ok = window.confirm("해당 응원글을 정말 삭제하시겠습니까?");
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
                <span ><img id ="pageImg-${cmtObj.id}" class="cardImage" src="${cmtObj.pageImg ?? null
            }" onerror="this.style.display='none';"></span>
                <h3 id = "postingTitle-${cmtObj.id}">${cmtObj.postingTitle}</h3>
                <p id = "postingDescription-${cmtObj.id}">${cmtObj.text}</p>
                <div>
                    <h4><span></span>${cmtObj.nickname ?? "닉네임 없음"}</h4>
                    <p class="${isOwner ? "updateBtns" : "noDisplay"
            }>follower</p>
                </div>
            `;
        // onclick = "ModalOpenOnMainPage(event)"
        // `<div class="card commentCard">
        //         <div class="card-body">
        //             <blockquote class="blockquote mb-0">
        //                 <p class="commentText">${cmtObj.text}</p>
        //                 <p id="${cmtObj.id
        //     }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
        //                 <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${cmtObj.profileImg
        //     }" alt="profileImg" /><span>${cmtObj.nickname ?? "닉네임 없음"
        //     }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
        //         .toString()
        //         .slice(0, 25)}</div></footer>
        //             </blockquote>
        //             <div class="${isOwner ? "updateBtns" : "noDisplay"}">
        //                  <button onclick="onEditing(event)" class="editBtn btn btn-dark">수정</button>
        //               <button name="${cmtObj.id
        //     }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
        //             </div>
        //           </div>
        //    </div>`;
        const div = document.createElement("div");
        div.classList.add("main_box");
        div.addEventListener("click", ModalOpenOnMainPage);
        div.innerHTML = temp_html;
        div.id = cmtObj.id;
        postingList.appendChild(div);
    });
};
export const onPageImgChange = (event) => {
    const theFile = event.target.files[0]; // file 객체
    const reader = new FileReader();
    reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
    reader.onloadend = (finishedEvent) => {
        // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
        const pageImgDataUrl = finishedEvent.currentTarget.result;
        localStorage.setItem("pageImgDataUrl", pageImgDataUrl);
        document.getElementById("pageImg").src = pageImgDataUrl;
    };
};

//  <div class="main_box">
//                 <span></span>
//                 <h3>제목을 입력해주세요.</h3>
//                 <p>내용을 입력해주세요.</p>
//                 <div>
//                     <h4><span></span>name</h4>
//                     <p>follower</p>
//                 </div>
//             </div>
// 위 코드를 innerHTML 넣어줄 코드로 변환
// const temp_html = `<div class="main_box">
//                 <span></span>
//                 <h3>${cmtObj.postingTitle}</h3>
//                 <p>${cmtObj.text}${cmtObj.id}</p>
//                 <div>
//                     <h4><span></span>${cmtObj.nickname ?? "닉네임 없음"
//     }</h4>
//                     <p>follower</p>
//                 </div>
//             </div>`;
// const div = document.createElement("div");
// div.classList.add("mycards");
// div.innerHTML = temp_html;
// postingList.appendChild(div);
// 이렇게 하면 됨
// 이제 이 코드를 getPostingList()에 넣어주면 됨
// const postingList = document.getElement("main_box"); //comment-list or commnet-list
// const currentUid = authService.currentUser.uid;
// postingList.innerHTML = "";
// cmtObjList.forEach((cmtObj) => {
//     const isOwner = currentUid === cmtObj.creatorId;
//     const temp_html =

//         `<div class="main_box">
//                 <span></span>
//                 <h3>${cmtObj.postingTitle}</h3>
