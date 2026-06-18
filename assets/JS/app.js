const cl = console.log;

const commentForm = document.getElementById("commentForm");
const name = document.getElementById("name");
const email = document.getElementById("email");
const postId = document.getElementById("postId");
const body = document.getElementById("body");
const editBtn = document.getElementById("editBtn");

const updateBtn = document.getElementById("updateBtn");
const cardContainer = document.getElementById("cardContainer");

const spinner = document.getElementById("spinner");

let postArr = [];

let baseURl = "https://jsonplaceholder.typicode.com";

function snackbar(msg, icon) {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

function fetchComment(ele) {
  spinner.classList.remove("d-none");

  let xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseURl}/comments`);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      postArr = JSON.parse(xhr.response);
      creatCard(postArr);
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });
      spinner.classList.add("d-none");
    }
  };
}

fetchComment();

function creatCard(ele) {
  let result = "";
  ele.forEach((element) => {
    result += `
  
            <div class="col-md-4 mt-3" id="${element.id}">
            <div class="card shadow h-100 d-flex flex-column">
                <div class="card-header">
                <div data-toggle="tooltip" data-placement="top" title="${element.name}"><strong>${element.name}</strong></div>
                </div>
                <div class="card-body">
                  <div><strong>Email : ${element.email}</strong></div>
                  
                  <div class="mt-4">${element.body}</div>

                  <div><strong>${element.postId}</strong></div>
                </div>
                <div class="card-footer d-flex justify-content-between border-primary">
                  <button class="btn btn-light  border-info"><i class="fa-solid text-info fa-pen-to-square" onclick="onEdit(this)"></i></button>

                  <button class="btn btn-light border-danger " onclick="onDelete(this)"><i class="fa-solid text-danger fa-trash"></i></button>
                </div>
              </div>
            </div>
  `;
  });
  cardContainer.innerHTML = result;
}

function onSubmit(eve) {
  eve.preventDefault();

  spinner.classList.remove("d-none");

  let newObj = {
    name: name.value,
    email: email.value,
    body: body.value,
    postId: postId.value,
  };

  postArr.push(newObj);

  let xhr = new XMLHttpRequest();
  let postUrl = `${baseURl}/comments`;
  xhr.open("POST", postUrl);
  xhr.send(JSON.stringify(newObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);
      let div = document.createElement("div");
      div.className = "col-md-4 mt-3";
      div.id = response.id;
      div.innerHTML = `
    
    <div class="card shadow h-100 d-flex justify-content-between">
                <div class="card-header" data-toggle="tooltip" data-placement="top" title="${newObj.name}">
                <strong>${newObj.name}</strong>
                </div>
                <div class="card-body">
                  <div><strong>Email : ${newObj.email}</strong></div>
                  
                  <div class="mt-4">${newObj.body}</div>

                  <div><strong>${newObj.postId}</strong></strong></div>
                </div>
                <div class="card-footer border-primary d-flex justify-content-between">
                  <button class="btn btn-light border-info" onclick="onEdit(this)"><i class="fa-solid text-info fa-pen-to-square"></i></button>
                  <button class="btn btn-light border-danger" onclick="onDelete(this)"><i class="fa-solid text-danger fa-trash"></i></button>
                </div>
              </div>
    
             
    `;
      cardContainer.prepend(div);
    }
    commentForm.reset();
    spinner.classList.add("d-none");
    snackbar("New post add successfully");
  };
}

function onEdit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest(".col-md-4").id;
  localStorage.setItem("editId", editId);

  let editUrl = `${baseURl}/comments/${editId}`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", editUrl);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      commentForm.classList.remove("d-none");

      name.value = editObj.name;
      email.value = editObj.email;
      postId.value = editObj.postId;
      body.value = editObj.body;

      editBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");

      commentForm.classList.remove("d-none");

      commentForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      spinner.classList.add("d-none");
    }
  };
}

function onUpdateHandalar(ele) {
  spinner.classList.remove("d-none");

  let updateId = localStorage.getItem("editId");

  let updateObj = {
    name: name.value,
    email: email.value,
    body: body.value,
    postId: postId.value,
  };

  let xhr = new XMLHttpRequest();
  let updateUrl = `${baseURl}/comments/${updateId}`;

  xhr.open("PATCH", updateUrl);
  xhr.send(JSON.stringify(updateObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);

      let div = document.getElementById(updateId);
      div.id = response.id;

      div.innerHTML = `
             <div class="card shadow h-100 d-flex justify-content-between">
                <div class="card-header">
                <strong>${updateObj.name}</strong>
                </div>
                <div class="card-body">
                  <div><strong>Email : ${updateObj.email}</strong></div>
                  
                  <div class="mt-4">${updateObj.body}</div>

                  <div><strong>${updateObj.postId}</strong></div>
                </div>
                <div class="card-footer border-primary d-flex justify-content-between">
                <button class="btn btn-light border-info" onclick="onEdit(this)"><i class="fa-solid text-info fa-pen-to-square"></i></button>
                <button class="btn btn-light border-danger" onclick="onDelete(this)"><i class="fa-solid text-danger fa-trash"></i></button>
              </div>
              </div>
      
            `;

      commentForm.reset();
      editBtn.classList.remove("d-none");
      updateBtn.classList.add("d-none");

      div.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      div.classList.add("highlight");

      setTimeout((highlight) => {
        div.classList.remove("highlight");
      }, 4000);
    }
    spinner.classList.add("d-none");
    snackbar("Post update successfully.", "success");
  };
}

function onDelete(ele) {
  spinner.classList.remove("d-none");

  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete it!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let deletId = ele.closest(".col-md-4").id;
      let deleteUrl = `${baseURl}/comments/${deletId}`;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", deleteUrl);
      xhr.send(null);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          ele.closest(".col-md-4").remove();
          spinner.classList.add("d-none");
        }
        snackbar("Post delete successfully.", "success");
      };
    }
  });
}

commentForm.addEventListener("submit", onSubmit);
updateBtn.addEventListener("click", onUpdateHandalar);
