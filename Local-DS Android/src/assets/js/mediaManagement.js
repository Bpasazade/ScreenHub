$(window).on("load", function() {
    fetchPlaylists();
    var currentPlaylistName = "";
    const playlistThead = $('#playlist-thead');
    playlistThead.hide();
    const playlistInitTxt = $('#playlist-init-txt');

    const addMediaForm = $("#addMediaForm");
    const createPlaylistForm = $("#playlistForm");
    
    createPlaylistForm.on("submit", function (event) {
        event.preventDefault();
        const playlistName = $("#playlistName").val();
        createPlaylist(playlistName);
    });

    const addMediaBtn = $("#addMediaBtn");
    addMediaBtn.on("click", function (event) {
        event.preventDefault();
        populateFolderDropdown();
    });

    const deletePlaylistBtn = $("#deletePlaylist");
    deletePlaylistBtn.on('click', async () => {
        const playlistName = deletePlaylistBtn.data('playlist');
        const formData = new FormData();
        formData.append('playlistname', playlistName);
        await deletePlaylist(formData);
    });

    const playlistList = $("#playlistList");
    playlistList.on("click", ".playlist-button, .playlist-options-btn", async function (event) {
        const target = $(event.target);
        if (target.hasClass("playlist-button")) {
            const playlistName = target.data("playlist");
            currentPlaylistName = target.data('playlist');
            console.log(currentPlaylistName);
            
            playlistInitTxt.hide();
            playlistThead.show();
            //showPlaylistContents(playlistName);
        } else if (target.hasClass('playlist-options-btn')) {
            const playlistName = target.data('playlist');
            deletePlaylistBtn.data('playlist', playlistName);
        }
    });

    addMediaForm.on("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(this);

        const selectedCheckboxes = $('input[name="selectedFiles"]:checked');
        const selectedFilenames = selectedCheckboxes.map(function () {
            return $(this).val();
        }).get();
        const selectedFolder = $("#uploadFolderSelect").val();

        const delayInputs = $('.delay-input');
        const delayTimes = delayInputs.map(function () {
            return $(this).val();
        }).get();
        const delayIntArray = delayTimes.filter(function (delay) {
            return delay !== "";
        }).map(function (delay) {
            return parseInt(delay);
        });

        formData.append('delayTimes', delayIntArray);
        formData.append('folderName', selectedFolder);
        formData.append("playlistName", currentPlaylistName);
        formData.append('selectedFiles', selectedFilenames);
        addContentToPlaylist(formData);
    });
});

async function createPlaylist(playlistName) {
    try {
        const response = await fetch('http://127.0.0.1:3000/createPlaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlistName })
        });
        const data = await response.json();
        if (data.success) {
            fetchPlaylists();
        } else {
            console.error('Folder creation failed:', data.message);
        }
    } catch (error) {
        console.error('Folder creation error:', error);
    }
}

async function fetchPlaylists() {
    try {
        const response = await fetch('http://127.0.0.1:3000/getPlaylists');
        const data = await response.json();
        if (data.playlists) {
            const playlistList = $("#playlistList");
            playlistList.empty();
            data.playlists.forEach(playlistName => {
                const playlist = $("<button>")
                    .addClass("btn list-group-item d-flex justify-content-between align-items-center playlist-button mb-3")
                    .attr("id", "playlistBtn")
                    .attr("data-playlist", playlistName)
                    .html(`<span>
                                <img src="../assets/img/mediaManagement/folder-yellow.svg" alt="Folder" width="30">
                                <span class="ms-2" style="font-size: 14px; font-weight: 400;">` + playlistName + `</span>
                            </span>
                            <img src="../assets/img/mediaManagementR/more.svg" alt="Folder" width="24">`);
                playlist.on('click', function (event) {
                    event.preventDefault();
                    const playlistName = $(this).data('playlist');
                    currentPlaylistName = playlistName;
                    showPlaylistContents(playlistName);
                });
                playlistList.append(playlist);
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
    const uploadFolderSelect = $("#uploadFolderSelect");
    uploadFolderSelect.empty();
    try {
        const response = await fetch('http://127.0.0.1:3000/getFolders');
        const data = await response.json();
        console.log(data);
        if (data.folders) {
            data.folders.forEach(function(folderName) {
                const option = $("<option>").val(folderName).text(folderName);
                uploadFolderSelect.append(option);
            });
            const selectedFolder = $("#uploadFolderSelect").val();
            if (selectedFolder) {
                showFolderContentInList(selectedFolder);
            }
        }

        uploadFolderSelect.on('change', function (event) {
            event.preventDefault();
            const selectedFolder = $(this).val();
            showFolderContentInList(selectedFolder);
        });
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

async function showFolderContentInList(selectedFolder) {
    const listGroup = $('#mediaListInFolder');
    listGroup.empty();
    
    try {
        const response = await fetch(`http://127.0.0.1:3000/getFolderContents?folderName=${selectedFolder}`);
        const data = await response.json();
        
        data.contents.forEach(content => {
            const listItem = $('<li>');

            const div = $('<div>').addClass('d-flex justify-content-between align-items-center');
            listItem.addClass('list-group-item align-items-center d-flex justify-content-between');
            const checkBox = $('<input>')
                .attr('type', 'checkbox')
                .addClass('form-check-input me-2')
                .val(content.fileName)
                .attr('id', content.fileName)
                .attr('name', 'selectedFiles');
            div.append(checkBox);
            
            const label = $('<label>')
                .addClass('form-check-label')
                .attr('for', content.fileName)
                .text(content.fileName);
            div.append(label);

            listItem.append(div);

            // const delayInput = $('<input>')
            //     .attr('type', 'number')
            //     .addClass('form-control delay-input float-end')
            //     .attr('id', content.fileName)
            //     .attr('name', 'delay')
            //     .attr('placeholder', 'Delay (ms)')
            //     .attr('style', 'width: 26% !important;');
            // listItem.append(delayInput);

            listGroup.append(listItem);
        });
    } catch (error) {
        console.error('Error fetching folder contents:', error);
    }
}

async function showPlaylistContents(playlistName) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/getPlaylistContents?playlistName=${playlistName}`);
        const data = await response.json();

        if (data.contents) {
            const playlistTbody = $('#playlist-tbody');
            playlistTbody.empty();

            data.contents.forEach(content => {
                const tr = $('<tr>');
                tr.addClass('text-center');

                const td = $('<td>');
                const checkBox = $('<input>');
                checkBox.attr('type', 'checkbox');
                checkBox.addClass('form-check-input');
                checkBox.val(content.fileName);
                checkBox.attr('id', content.fileName);
                checkBox.attr('name', 'selectedFiles');
                td.append(checkBox);
                tr.append(td);

                const td2 = $('<td>');
                td2.addClass("fileDesc");
                td2.text(content.fileName);
                tr.append(td2);

                const td3 = $('<td>');
                td3.addClass("fileDesc");
                td3.text(content.delay + "s");
                tr.append(td3);

                const td4 = $('<td>');
                td4.addClass("fileDesc");
                td4.text(content.mTime || "N/A");
                tr.append(td4);

                const td5 = $('<td>');
                td5.addClass("fileDesc");

                const div = $('<div>');
                div.addClass('col d-flex justify-content-center align-items-center')
                   .css('width', 'fit-content');

                div.html(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" id="playMediaBtn" data-media="${content.fileName}">
                                <span>
                                    <img src="../assets/img/mediaManagement/play-circle.svg" alt="Play" width="25">
                                </span>
                            </button>
                            <div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>
                            <button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" id="deleteMediaBtn" data-media="${content.fileName}">
                                <span>
                                    <img src="../assets/img/mediaManagement/trash-can.svg" alt="Trash Can" width="25">
                                </span>
                            </button>
                            <div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>
                            <button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" id="downloadMediaBtn" data-media="${content.fileName}">
                                <span>
                                    <img src="../assets/img/mediaManagement/direct-download.svg" alt="Download" width="25">
                                </span>
                            </button>
                            <div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>
                            <button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" id="editMediaBtn" data-media="${content.fileName}">
                                <span>
                                    <img src="../assets/img/mediaManagement/message-edit.svg" alt="Edit" width="25">
                                </span>
                            </button>`);

                $('#playMediaBtn').on('click', function (event) {
                    event.preventDefault();

                    const fileUrl = content.filePath;
                    const fileName = content.fileName;
                    const fileType = fileName.substr((fileName.lastIndexOf('.') + 1));
                    console.log(fileUrl + "  " + fileType);
                    displayInModal(fileUrl, fileType, fileName);
                }); 

                td5.append(div);
                tr.append(td5);
                playlistTbody.append(tr);
            });
        }
    } catch (error) {
        console.error('Error fetching playlist contents:', error);
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

function displayInModal(fileUrl, fileType, fileName) {
    console.log(fileUrl + "  " + fileType);
    const modal = $('#mediaModal');
    const modalContent = $('#mediaModalContent');
    const mediaNameLabel = $('#mediaNameLabel');
    mediaNameLabel.text(fileName);

    modalContent.empty();
    
    // Create appropriate element based on file type
    if (fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg")) {
        const imgElement = $('<img>')
            .html("src='../../' + fileUrl)");
        modalContent.append(imgElement);
    } else if (fileType.startsWith("mp4") || fileType.startsWith("mkv") || fileType.startsWith("mov") || fileType.startsWith("wmv")) {
        const videoElement = $('<video>').attr('controls', true);
        const sourceElement = $('<source>').attr('src', '../../' + fileUrl).attr('type', fileType);
        videoElement.append(sourceElement);
        modalContent.append(videoElement);
    }

    modal.modal('show');
}