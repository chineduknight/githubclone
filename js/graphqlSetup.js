const bookContainer = document.querySelector("#book-container");
const form = document.querySelector("#user-search");

const getRepos = (keyword) =>
  `
	query {
	  repositoryOwner(login:"${keyword}"){
      id
      login
      avatarUrl
      repositories(last: 20){
       nodes {
        name
        forkCount
        stargazerCount
        updatedAt
       }
      }
    }
}
	`;

const renderBooks = ({ data }) => {
  console.log("data:", data);
  const allRepos = data.repositoryOwner.repositories.nodes;
  const userAvatar = document.querySelector("#user-avatar");
  const userAvatarSmall = document.querySelector("#user-avatar-small");
  const userName = document.querySelector("#user-name");
  userName.innerHTML = data.repositoryOwner.login;
  userAvatar.src = data.repositoryOwner.avatarUrl;
  userAvatarSmall.src = data.repositoryOwner.avatarUrl;
  const repositoryList = document.querySelector(".repo-list");
  allRepos.forEach((book) => {
    const divWrapper = document.createElement("div");
    const {
      name,
      forkCount,
      stargazerCount,
      updatedAt,
      description = "",
    } = book;
    divWrapper.innerHTML = `
    <div class="content">
    <h2>${name}</h2>
    <p>${description} </p>
      <ul>
        <li><span class="repo-lang"></span> HTML</li>
        <li><i class="far fa-star"></i> ${stargazerCount}</li>
        <li><i class="fas fa-code-branch"></i> ${forkCount}</li>
        <li>Updated on ${new Date(updatedAt)}</li>
      </ul>
    </div>
    <button class="btn2"><i class="far fa-star"></i> Star</button>
    
    `;

    divWrapper.className = "repo";
    repositoryList.appendChild(divWrapper);
  });
};

const getUser = (ev) => {
  ev.preventDefault();
  const userName = form.elements["search"].value;

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + "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",
    },
    body: JSON.stringify({
      query: getRepos(userName),
    }),
  };

  fetch(`https://api.github.com/graphql`, options)
    .then((res) => res.json())
    .then(renderBooks)
    .catch((error) => console.log("error", error));
};
form.addEventListener("submit", getUser);
