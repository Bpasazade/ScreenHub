document.addEventListener("DOMContentLoaded", function () {
    fetchPlaylists();
    
    const createPlaylistForm = document.getElementById("playlistForm");
    createPlaylistForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const playlistName = createPlaylistForm.querySelector("#playlistName").value;
        createPlaylist(playlistName);
    });

    const playlistList = document.getElementById("playlistList");
    playlistList.addEventListener("click", function (event) {
        if (event.target.classList.contains("playlist-button")) {
            const folderName = event.target.getAttribute("data-playlist");
            // const delayInputs = document.querySelectorAll('.delay-input');
            // const delayTimes = Array.from(delayInputs).map(input => input.value);
            showPlaylistContents(folderName);
        }
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
                    "<i class='bi bi-three-dots float-end btn-primary shadow-none' data-bs-toggle='modal' data-bs-target='#playlistOptionsModal' id='playlistOptions'></i>" +
                    "</div>";

                playlistList.appendChild(playlist);

                const deletePlaylistBtn = document.getElementById("deletePlaylist");
                /*deletePlaylistBtn.addEventListener("click", async () => {
                    let data = new FormData();
                    data.append('foldername', playlistName);
                    // IMPORTANT !!
                    //await deletePlaylist(data);
                });*/
            });
        }
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

/*async function showPlaylistContents() {
    try {
        const response = await fetch(`/getFolderContents?folderName=${folderName}`);
        const data = await response.json();

        if (data.contents) {

        }
    } catch (error) {
        console.error("Error fetching playlist contents:", error);
    }
}*/