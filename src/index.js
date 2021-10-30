import "bootstrap/scss/bootstrap.scss";
import http from "./http.js";

// http.readPosts().then((val)=>{
//     console.log(val);
// })

const renderPost = (post) => {
  const { id, title, description } = post;
  const listNode = document.querySelector("#list");
  const newCard = document.createElement("div");
  newCard.className = `
            mb-3
            p-2
            card
            d-flex
            flex-row
            justify-content-between
            align-items-center
    `;
  newCard.innerHTML = `
    <div>
        <p><strong>${title}</strong></p>
        <p>${description}</p>
    </div>

    <div>
        <button class="btn btn-info btn-start-edit" data-id=${id}>Edit</button>
        <button class="btn btn-danger btn-remove" data-id=${id}>Remove</button>
    </div>
    `;
  listNode.appendChild(newCard);
};

const renderAllPost = () => {
  return http.readPosts().then((postList) => {
    postList.forEach((post) => {
      renderPost(post);
    });
  });
};

const alertMsg = (msg, type = "success") => {
  const newAlert = document.createElement("div");
  newAlert.className = `alert alert-${type}`;
  newAlert.innerHTML = msg;
  document.querySelector("#notification").appendChild(newAlert);
  setTimeout(() => {
    newAlert.remove();
  }, 3000);
};

const clearForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#list").innerHTML = "";
  return renderAllPost();
};

const addPost = (post) => {
  http
    .createPost(post)
    .then(() => {
      return clearForm();
    })
    .then(() => {
      alertMsg("Add successfuly");
    });
};

const editStart = (id) => {
  http.readPost(id).then((post) => {
    const { id, title, description } = post;
    document.querySelector("#title").value = title;
    document.querySelector("#description").value = description;
    document.querySelector("#btn-group").classList.remove("d-none");
    document.querySelector("#btn-add").classList.add("d-none");
    document.querySelector("#btn-edit").dataset.id = id;
  });
};


const editEnd = (id, post) => {
  http
    .updatePost(id, post)
    .then(() => {
      return clearForm();
    })
    .then(() => {
      alertMsg("Updated");
    });
};

const removePost = (id) => {
    http
      .readPost(id)
      .then((post) => {
        const { id, title, description } = post;
        const isConfirm = confirm(`Remove: ${title}`);
        if (isConfirm) {
          return http.deletePost(id);
        }
      })
      .then(() => {
        clearForm();
      });
  };

const initPost = () => {
  renderAllPost();
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    if (title != "" && description != "") {
      addPost({ title, description });
    }
  });

  document.querySelector("#list").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-start-edit")) {
      editStart(event.target.dataset.id);
    }
  });

  document.querySelector("#btn-back").addEventListener("click", (event) => {
    event.preventDefault();
    clearForm();
    document.querySelector("#btn-group").classList.add("d-none");
    document.querySelector("#btn-add").classList.remove("d-none");
  });

  document.querySelector("#btn-edit").addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const id = event.target.dataset.id;
    editEnd(id, { title, description });
    document.querySelector("#btn-group").classList.add("d-none");
    document.querySelector("#btn-add").classList.remove("d-none");
  });

  document.querySelector("#list").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
      removePost(event.target.dataset.id);
    }
  });
};

window.addEventListener("DOMContentLoaded", initPost);
