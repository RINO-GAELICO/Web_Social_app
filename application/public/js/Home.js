let container = document.getElementById("container");

function createCard(photo, container) {
    let photoElement = document.createElement("div");
    photoElement.id = `photo-${photo.id}`;
    photoElement.classList.add(`photo`);
    photoElement.innerHTML = `<img src= ${photo.url} alt="this should be an image">`;
    photoElement.innerHTML += `\n <h1 class="photo_title">${photo.title}</h1>`;
    container.appendChild(photoElement);
}

if(container){
    let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
    fetch(fetchURL)
        .then((data)=> data.json())
        .then((photos)=> {
            photos.forEach((photo)=> {
                createCard(photo, container);
            });
            document.getElementById("photo_count").innerHTML= `There are ${photos.length} photo(s) being shown `;
            let fadeTarget = document.querySelectorAll(".photo");
            fadeTarget.forEach((photo)=> {
                photo.addEventListener('click',fadeout);
            });

        })
}


function fadeout(event){
    let fadeTarget = event.target;
    let fadeEffect = setInterval(function() {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.08;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.parentElement.parentElement.removeChild(fadeTarget.parentElement);
            let totalPhotos = document.querySelectorAll(".photo");
            document.getElementById("photo_count").innerHTML= `There are ${totalPhotos.length} photo(s) being shown `;
        }
    }, 80);
}