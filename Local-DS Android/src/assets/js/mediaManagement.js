$(document).ready(function() {
    fetchPlaylists();
    var currentPlaylistName = "";

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
            showPlaylistContents(playlistName);
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
                const playlistList = $("#playlistList");
                playlistList.empty();
                data.playlists.forEach(playlistName => {
                    const playlist = $("<button>")
                        .addClass("btn btn-outline-secondary mb-3 d-flex playlist-button justify-content-between align-items-center")
                        .attr("data-playlist", playlistName)
                        .html(`
                            <div class='d-flex align-items-center'>
                                <i class='bi bi-soundwave me-2 float-start'></i>
                                <span class='folder float-start' id=''>${playlistName}</span>
                            </div>
                            <div class='d-flex align-items-center'>
                                <i class='bi bi-three-dots float-end btn-primary shadow-none playlist-options-btn' data-bs-toggle='modal' data-bs-target='#playlistOptionsModal' data-playlist='${playlistName}'></i>
                            </div>
                        `);
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
            const response = await fetch('/getFolders');
            const data = await response.json();
            console.log(data);
            if (data.folders) {
                data.folders.forEach(function(folderName) {
                    const option = $("<option>").val(folderName).text(folderName);
                    uploadFolderSelect.append(option);
                });
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
            const response = await fetch(`/getFolderContents?folderName=${selectedFolder}`);
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

                const delayInput = $('<input>')
                    .attr('type', 'number')
                    .addClass('form-control delay-input float-end')
                    .attr('id', content.fileName)
                    .attr('name', 'delay')
                    .attr('placeholder', 'Delay (ms)')
                    .attr('style', 'width: 26% !important;');
                listItem.append(delayInput);

                listGroup.append(listItem);
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
                const playlistContents = $('#playlistContents');
                playlistContents.empty();

                data.contents.forEach(content => {
                    const li = $('<li>')
                        .addClass('list-group-item d-flex justify-content-between align-items-center');

                    const span = $('<span>')
                        .addClass('d-flex align-items-center');

                    const i = $('<i>')
                        .addClass('drag-handle cursor-move bi bi-list align-text-bottom me-2');

                    const divImg = $('<div>')
                        .addClass('col-2 p-1');

                    const image = $('<img>')
                        .addClass('img-fluid rounded me-2')
                        .attr('src', content.filePath);

                    divImg.append(image);

                    const divText = $('<div>')
                        .addClass('col-6 p-1 row');

                    const fileName = $('<span>')
                        .text(content.fileName);

                    const filePath = $('<span>')
                        .addClass('text-secondary')
                        .text(content.filePath);

                    divText.append(fileName);
                    divText.append(filePath);

                    const delayTime = $('<span>')
                        .addClass('text-secondary col-1 justify-content-center d-flex align-items-center')
                        .text(content.delay + "s Duration");

                    const delFile = $('<td>');
                    const delFileBtn = $('<button>')
                        .html("<i class='bi bi-trash3' style='color: red'></i>")
                        .attr('style', 'background: none; border: 0px;')
                        .on('click', async function () {
                            let data = new FormData();
                            data.append('playlist', currentPlaylistName);
                            data.append('filename', content.fileName);
                            await deleteMedia(data);
                        });
                    delFile.append(delFileBtn);

                    span.append(i);
                    span.append(divImg);
                    span.append(divText);
                    span.append(delayTime);
                    span.append(delFile);

                    li.append(span);
                    playlistContents.append(li);
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

});