document.addEventListener("DOMContentLoaded", function () {
    fetchPlaylists();
    var currentPlaylistName = "";

    const addMediaForm = document.getElementById("addMediaForm");
    
    const createPlaylistForm = document.getElementById("playlistForm");
    createPlaylistForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const playlistName = createPlaylistForm.querySelector("#playlistName").value;
        createPlaylist(playlistName);
    });

    const addMediaBtn = document.getElementById("addMediaBtn");
    addMediaBtn.addEventListener("click", function (event) {
        event.preventDefault();
        populateFolderDropdown();
    });

    const deletePlaylistBtn = document.getElementById("deletePlaylist");
    deletePlaylistBtn.addEventListener('click', async () => {
        const playlistName = deletePlaylistBtn.getAttribute('data-playlist');
        const formData = new FormData();
        formData.append('playlistname', playlistName);
        await deletePlaylist(formData);
    });

    const playlistList = document.getElementById("playlistList");
    playlistList.addEventListener("click", async function (event) {
        if (event.target.classList.contains("playlist-button")) {
            const playlistName = event.target.getAttribute("data-playlist");
            currentPlaylistName = event.target.getAttribute('data-playlist');
            console.log(currentPlaylistName);
            // const delayInputs = document.querySelectorAll('.delay-input');
            // const delayTimes = Array.from(delayInputs).map(input => input.value);
            showPlaylistContents(playlistName);
        } else if (event.target.classList.contains('playlist-options-btn')) {
            const playlistName = event.target.getAttribute('data-playlist');
            // Store the playlist name in a data attribute on the delete button within the modal
            deletePlaylistBtn.setAttribute('data-playlist', playlistName);
        }
    });

    addMediaForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(addMediaForm);

        const selectedCheckboxes = document.querySelectorAll('input[name="selectedFiles"]:checked');
        // Extract the filenames from the selected checkboxes
        const selectedFilenames = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
        const selectedFolder = document.getElementById("uploadFolderSelect").value;

        // Delay times
        const delayInputs = document.querySelectorAll('.delay-input');
        const delayTimes = Array.from(delayInputs).map(input => input.value);
        length = delayTimes.length;
        var delayIntArray = [];
  
        for (var i = 0; i < length; i++)
            if (delayTimes[i] != "")
            delayIntArray.push(parseInt(delayTimes[i]));

        console.log(delayIntArray);

        formData.append('delayTimes', delayIntArray);
        formData.append('folderName', selectedFolder);
        formData.append("playlistName", currentPlaylistName);
        formData.append('selectedFiles', selectedFilenames);
        addContentToPlaylist(formData);
    });
});

async function createPlaylist(playlistName) {
    try {
        const response = await fetch('/createPlaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlistName })
        });
        const data = await response.json();
        if (data.success) {
            //fetchPlaylists();
        } else {
            console.error('Folder creation failed:', data.message);
        }
    } catch (error) {
        console.error('Folder creation error:', error);
    }
}

async function fetchPlaylists() {
    try {
        const response = await fetch('/getPlaylists');
        const data = await response.json();
        if (data.playlists) {
            const playlistList = document.getElementById("playlistList");
            playlistList.innerHTML = "";
            data.playlists.forEach(playlistName => {
                const playlist = document.createElement("button");
                playlist.classList.add("btn");
                playlist.classList.add("btn-outline-secondary");
                playlist.classList.add("mb-3");
                playlist.classList.add("d-flex");
                playlist.classList.add("playlist-button");
                playlist.classList.add("justify-content-between");
                playlist.classList.add("align-items-center");
                playlist.setAttribute("data-playlist", playlistName);

                playlist.innerHTML = 
                    "<div class='d-flex align-items-center'>" +
                    "<i class='bi bi-soundwave me-2 float-start'></i>" +
                    "<span class='folder float-start' id='' >" + playlistName + "</span>" +
                    "</div>" +
                    "<div class='d-flex align-items-center'>" +
                    "<i class='bi bi-three-dots float-end btn-primary shadow-none playlist-options-btn' data-bs-toggle='modal' data-bs-target='#playlistOptionsModal' data-playlist='" + playlistName + "'></i>" +
                    "</div>";

                playlistList.appendChild(playlist);

                /*const deletePlaylistBtn = document.getElementById("deletePlaylist");
                deletePlaylistBtn.addEventListener("click", async () => {
                    let data = new FormData();
                    data.append('playlistname', playlistName);
                    await deletePlaylist(data);
                });*/
            });
        }
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

async function addContentToPlaylist(formdata) {
    try {
        const response = await fetch('/addMediaToPlaylist', {
            method: 'POST',
            body: formdata
        });

        const data = await response.json();
        if (data.success) {
            await showPlaylistContents(currentPlaylistName);
        } else {
            console.error('Upload failed:', data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

async function populateFolderDropdown() {
    const uploadFolderSelect = document.getElementById("uploadFolderSelect");
    uploadFolderSelect.innerHTML = "";
    try {
        const response = await fetch('/getFolders');
        const data = await response.json();
        console.log(data);
        if (data.folders) {
            data.folders.forEach(folderName => {
                const option = document.createElement("option");
                option.value = folderName;
                option.textContent = folderName;
                uploadFolderSelect.appendChild(option);
            });
        }

        uploadFolderSelect.addEventListener('change', function (event) {
            event.preventDefault();
            const selectedFolder = this.value;
            showFolderContentInList(selectedFolder);
        });
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

async function showFolderContentInList(selectedFolder) {
    const listGroup = document.querySelector('#mediaListInFolder');
    listGroup.innerHTML = "";
    
    try {
        const response = await fetch(`/getFolderContents?folderName=${selectedFolder}`);
        const data = await response.json();
        
        data.contents.forEach(content => {
            const listItem = document.createElement('li');

            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between align-items-center';

            listItem.className = 'list-group-item align-items-center d-flex justify-content-between';
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.className = 'form-check-input me-2';
            checkBox.value = content.fileName;
            checkBox.id = content.fileName;
            checkBox.name = 'selectedFiles';
            div.appendChild(checkBox);
            

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = content.fileName;
            label.textContent = content.fileName;
            div.appendChild(label);

            listItem.appendChild(div);

            const delayInput = document.createElement('input');
            delayInput.type = 'number';
            delayInput.className = 'form-control delay-input float-end';
            delayInput.id = content.fileName;
            delayInput.name = 'delay';
            delayInput.placeholder = 'Delay (ms)';
            delayInput.style = 'width: 26% !important;';
            listItem.appendChild(delayInput);

            listGroup.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching folder contents:', error);
    }
}

async function showPlaylistContents(playlistName) {
    try {
        const response = await fetch(`/getPlaylistContents?playlistName=${playlistName}`);
        const data = await response.json();
        
        if (data.contents) {



            const playlistContents = document.getElementById("playlistContents");
            playlistContents.innerHTML = "";

            data.contents.forEach(content => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.classList.add("d-flex");
                li.classList.add("justify-content-between");
                li.classList.add("align-items-center");

                const span = document.createElement("span");
                span.classList.add("d-flex");
                //span.classList.add("justify-content-between");
                span.classList.add("align-items-center");

                // List Icon (Drag Handle)
                const i = document.createElement("i");
                i.classList.add("drag-handle");
                i.classList.add("cursor-move");
                i.classList.add("bi");
                i.classList.add("bi-list");
                i.classList.add("align-text-bottom");
                i.classList.add("me-2");

                // Image Thumbnail
                const divImg = document.createElement("div");
                divImg.classList.add("col-2");
                divImg.classList.add("p-1");

                const image = document.createElement("img");
                image.classList.add("img-fluid");
                image.classList.add("rounded");
                image.classList.add("me-2");
                image.setAttribute("src", content.filePath);

                divImg.appendChild(image);

                // Filename
                const divText = document.createElement("div");
                divText.classList.add("col-6");
                divText.classList.add("p-1");
                divText.classList.add("row");

                const fileName = document.createElement("span");
                fileName.textContent = content.fileName;

                const filePath = document.createElement("span");
                filePath.classList.add("text-secondary");
                filePath.textContent = content.filePath;

                divText.appendChild(fileName);
                divText.appendChild(filePath);

                // Delay Time
                const delayTime = document.createElement("span");
                delayTime.classList.add("text-secondary");
                delayTime.classList.add("col-1");
                delayTime.classList.add("justify-content-center");
                delayTime.classList.add("d-flex");
                delayTime.classList.add("align-items-center");
                delayTime.textContent = content.delay + "s Duration";

                // Delete
                const delFile = document.createElement('td');
                const delFileBtn = document.createElement('button');
                delFileBtn.innerHTML = "<i class='bi bi-trash3' style='color: red'></i>";
                delFileBtn.style = "background: none"
                delFileBtn.style.border = "0px";
                delFileBtn.addEventListener("click", async function () {
                    let data = new FormData();
                    data.append('playlist', currentPlaylistName);
                    data.append('filename', content.fileName);
            
                    await deleteMedia(data);
                });
                delFile.appendChild(delFileBtn);

                // Append to list item
                span.appendChild(i);
                span.appendChild(divImg);
                span.appendChild(divText);
                span.appendChild(delayTime);
                span.appendChild(delFile);
                li.appendChild(span);
                playlistContents.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error fetching playlist contents:", error);
    }
}

async function deleteMedia(formData) {
    try {
        const response = await fetch('/deleteMedia', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            // Refresh folder contents after deletion
            showPlaylistContents(currentPlaylistName);
        } else {
            console.error('Delete failed:', data.error);
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}

async function deletePlaylist(formData) {
    try {
        const response = await fetch('/deletePlaylist', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            //await showPlaylistContents(currentPlaylistName);
        } else {
            console.error('Upload failed:', data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}