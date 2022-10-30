function setflashMessageFadeOut(flashMessage) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.5) {
                clearInterval(timer);
                flashMessage.remove();
            }
            currentOpacity = currentOpacity - 0.05;
            flashMessage.style.opacity = currentOpacity;
        }, 50)
    }, 3000)
}

function addFlashFromFrontEnd(message) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id','flashMessage');
    innerFlashDiv.setAttribute('class', 'alert alert-success');
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setflashMessageFadeOut(flashMessageDiv);
}

function createCard(postData) {
    return `<div id="post-${postData.postId}" class="card">
    <img class="card-image" src=${postData.thumbnail} alt="Missing Image">
    <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p clas="card-text">${postData.postText}</p>
        <a href="/post/${postData.postId}" class="anchor-buttons">Post Details</a>
    </div>
</div>`;
}


function executeSearch() {
    let searchTerm = document.getElementById('search-text').value;
    if (!searchTerm) {
        location.replace('/');
        return;
    }
    let mainContent = document.getElementById('main-content');
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then((data) => {
            return data.json();
        })
        .then((data_json) => {
            let newMainContentHTML = '';
            data_json.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            mainContent.innerHTML = newMainContentHTML;
            if (data_json.message) {
                addFlashFromFrontEnd(data_json.message);
            }
        })
        .catch((err) => console.log(err));
}

let flashElement = document.getElementById('flashMessage');

if (flashElement) {
    setflashMessageFadeOut(flashElement);
}

let searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.onclick = executeSearch;
}