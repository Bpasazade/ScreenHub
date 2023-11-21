export var currentPlaylistName = "";
var activePlaylistName = null;
var activeTarget = null;
var previousTarget = null;
$(window).on("load", function() {
    fetchPlaylists();

    $("#playlist-tbody").sortable({
        forcePlaceholderSize: true,
        axis: "y",
        update: function(event, ui) {
            var data = $(this).sortable('serialize');
            console.log(data);
            // $.ajax({
            //     data: data,
            //     type: 'POST',
            //     url: '/updatePlaylistOrder'
            // });
        }
    });

    var forcePlaceholderSize = $( "#playlist-tbody" ).sortable( "option", "forcePlaceholderSize" );

    $("#playlist-tbody").sortable( "option", "forcePlaceholderSize", true );

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
        populateFoldersInModal();
    });

    const deletePlaylistBtn = $("#deletePlaylist");
    deletePlaylistBtn.on('click', async () => {
        const playlistName = deletePlaylistBtn.data('playlist');
        const formData = new FormData();
        formData.append('playlistname', playlistName);
        await deletePlaylist(formData);
    });

    $("#activePlaylistBtn").on("click", function (event) {
        if (isPlaylistEmpty(activePlaylistName)) {
            $('.toast-body').text('Playlist boş olduğu için aktif edilemez.');
            $('.toast').toast('show');
            return;
        }

        event.preventDefault();
        if (previousTarget !== null) {
            previousTarget[0].style.backgroundColor = "#F6F6F6";
            previousTarget[0].style.border = "2px solid #DDDDDD";
            previousTarget[0].children[0].children[0].attributes[0].value = "../assets/img/mediaManagement/note.svg";
        }

        previousTarget = activeTarget;

        $("#activePlaylistBtn").attr("disabled", true);
        activePlaylistName = currentPlaylistName;
        activeTarget[0].style.backgroundColor = "#05AF071A";
        activeTarget[0].style.border = "2px solid #05AF07";
        activeTarget[0].children[0].children[0].attributes[0].value = "../assets/img/mediaManagement/note-green.svg";
    });

    const playlistList = $("#playlistList");
    playlistList.on("click", ".playlist-button, .playlist-options-btn", async function (event) {
        const target = $(event.target);
        if (target[0] === previousTarget[0]) {
            $("#activePlaylistBtn").attr("disabled", true);
        }
        activeTarget = target;

        if (target.hasClass("playlist-button")) {
            $("#addMediaBtn").attr("disabled", false);
            $('#deleteSelections').css("visibility", "hidden");
            $("#activePlaylistBtn").css("visibility", "visible");
            if (currentPlaylistName !== activePlaylistName) {
                $("#activePlaylistBtn").attr("disabled", false);
            }
            const playlistName = target.data("playlist");
            currentPlaylistName = target.data('playlist');
            
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

        //formData.append('delayTimes', delayIntArray);
        formData.append('folderName', selectedFolder);
        formData.append("playlistName", currentPlaylistName);
        formData.append('selectedFiles', selectedFilenames);
        addContentToPlaylist(formData);
    });
});

async function isPlaylistEmpty(playlistName) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/isPlaylistEmpty?playlistName=${playlistName}`);
        const data = await response.json();
        if (data.success) {
            return data.empty;
        } else {
            console.error('Playlist empty check failed:', data.error);
        }
    }
    catch (error) {
        console.error('Playlist empty check error:', error);
    }
}

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
            var activePlaylist = "Playlist1";

            data.playlists.forEach(playlistName => {
                const playlist = $("<button>")
                    .addClass("btn list-group-item d-flex justify-content-between align-items-center playlist-button mb-3")
                    .attr("id", "playlistBtn")
                    .attr("data-playlist", playlistName)
                    .html(`<span style="pointer-events: none;">
                                <img src="../assets/img/mediaManagement/note.svg" alt="Folder" width="24">
                                <span class="ms-2" style="font-size: 14px; font-weight: 400;">` + playlistName + `</span>
                            </span>
                            <img src="../assets/img/mediaManagementR/more.svg" alt="Folder" width="24">`);

                if (playlistName === activePlaylist) {
                    activePlaylistName = playlistName;
                    previousTarget = playlist;
                    playlist.css("background", "#05AF071A");
                    playlist.css("border", "2px solid #05AF07");
                    playlist.find('img').eq(0).attr("src", "../assets/img/mediaManagement/note-green.svg");
                }

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
        const response = await fetch('http://127.0.0.1:3000/addMediaToPlaylist', {
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

async function populateFoldersInModal() {
    const addMediaFolderList = $("#addMediaFolderList");
    addMediaFolderList.empty();
    try {
        const response = await fetch('http://127.0.0.1:3000/getFolders');
        const data = await response.json();
        console.log(data);
        if (data.folders) {
            
            for (let i = 0; i < data.folders.length; i++) {
                const folder = data.folders[i];
                const folderNameModal = $("#folderNameModal");
                
                const vector = $(`
                                <span class="ms-2 pb-3 me-2" style="font-size: 14px; font-weight: 400;">
                                    <img src="../assets/img/mediaManagement/vector1447.svg" alt="Folder" width="14">
                                </span>`);                


                const folderBtnDiv = $("<div>")
                    .addClass("d-flex justify-content-between align-items-center")
                    .css("width", "100%");

                folderBtnDiv.append(vector);

                const folderBtn = $("<button>")
                    .addClass("btn col-md-10 list-group-item d-flex justify-content-start align-items-center playlist-button mb-3 p-3")
                    .css("border-radius", "9px")
                    .css("border", "1px solid #DDD")
                    .css("background", "#F6F6F6")

                    const folderIcon = $(`<svg width="30" class="folder-button" height="27" viewBox="0 0 85 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_9_3672)">
                                            <path d="M0 20.174V7.69792C0 3.44605 3.42413 0 7.64896 0H24.081C25.7005 0 27.2773 0.516834 28.5858 1.47698L35.7407 6.72467H77.3518C81.5759 6.72467 85.0008 10.1707 85.0008 14.4226V20.174H0Z" fill="#FBB03B"/>
                                            <path d="M77.351 11.8857H7.64896C3.42456 11.8857 0 15.3322 0 19.5837V63.3028C0 67.5543 3.42456 71.0008 7.64896 71.0008H77.351C81.5754 71.0008 85 67.5543 85 63.3028V19.5837C85 15.3322 81.5754 11.8857 77.351 11.8857Z" fill="#FFCC00"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_9_3672">
                                            <rect width="85" height="71" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>`);

                    const folderColor = data.colors[i];

                    let r = parseInt(folderColor.substr(1,2), 16);
                    let g = parseInt(folderColor.substr(3,2), 16);
                    let b = parseInt(folderColor.substr(5,2), 16);

                    r = (r >= 50) ? parseInt(folderColor.substr(1,2), 16) - 50 : 0;
                    g = (g >= 50) ? parseInt(folderColor.substr(3,2), 16) - 50 : 0;
                    b = (b >= 50) ? parseInt(folderColor.substr(5,2), 16) - 50 : 0;

                    const folderColorHex = RGB2Color(r, g, b);

                    folderIcon.find('path').eq(0).attr("fill", folderColorHex);
                    folderIcon.find('path').eq(1).attr("fill", folderColor);

                    folderBtn.append(folderIcon);

                    const folderName = $(`<p class="ms-3 mb-0" style="font-size: 14px; font-weight: 400;">${folder}</p>`);

                    folderBtn.append(folderName);

                    folderBtn.on('click', function (event) {
                        event.preventDefault();
                        const folderName = $(this).data('folder');
                        folderNameModal.text(folder);
                        showFolderContentInTable(folder);
                    });

                    folderBtnDiv.append(folderBtn);

                    addMediaFolderList.append(folderBtnDiv);
            }
            const selectedFolder = $("#uploadFolderSelect").val();
            if (selectedFolder) {
                showFolderContentInList(selectedFolder);
            }
        }
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}
function byte2Hex (n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

async function showFolderContentInTable(selectedFolder) {
    const folderListTbody = $('#folderlist-upload-tbody');
    folderListTbody.empty();
    
    try {
        const response = await fetch(`http://127.0.0.1:3000/getFolderContents?folderName=${selectedFolder}`);
        const data = await response.json();
        
        if (data.contents) {
            folderListTbody.empty();

            for (let i = 0; i < data.contents.length; i++) {
                const content = data.contents[i];
                const tr = $('<tr>');
                tr.addClass('text-center table-row');

                const td = $('<td>');
                const checkBox = $('<input>');
                checkBox.attr('type', 'checkbox');
                checkBox.addClass('btn-check ms-2');
                checkBox.attr('autocomplete', 'off');
                checkBox.val(content.fileName);
                checkBox.attr('id', content.fileName);
                checkBox.attr('name', 'selectedFiles');
                td.append(checkBox);

                const label = $('<label>');
                label.addClass('btn rounded-circle shadow-0 border-0 p-0');
                label.attr('for', content.fileName);
                label.html(`<img src="../assets/img/mediaManagement/add-circle.svg" alt="add-circle" width="20">`);

                checkBox.on('click', function (event) {
                    event.preventDefault();
                    const fileName = $(this).val();
                    const curPlaylistName = currentPlaylistName;
                    const formData = new FormData();
                    formData.append('selectedFile', fileName);
                    formData.append('playlistName', curPlaylistName);
                    formData.append('folderName', selectedFolder);
                    checkBox.attr('disabled', true);
                    addContentToPlaylist(formData);
                });

                td.append(label);
                tr.append(td);

                const td2 = $('<td>');
                td2.addClass("fileDesc");
                td2.text(content.fileName);
                tr.append(td2);

                const td21 = $('<td>');
                td21.addClass("fileDesc");

                const fileType = content.fileName.substr((content.fileName.lastIndexOf('.') + 1));

                let delay = 0;
                if(fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg")) {
                    delay = 0;
                } else {
                    delay = content.delay;
                }

                const td3 = $('<td>');
                td3.addClass("fileDesc");
                td3.text(delay + "s");
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

                const playMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.fileName}">
                                            <span>
                                                <img src="../assets/img/mediaManagement/play-circle.svg" alt="Play" width="25">
                                            </span>
                                        </button>`);
             
                playMediaBtn.on('click', function (event) {
                   event.preventDefault();
                   const fileUrl = content.filePath;
                   const fileName = content.fileName;
                   const fileType = fileName.substr((fileName.lastIndexOf('.') + 1));
                   console.log(fileUrl + "  " + fileType);
                   displayInModal(fileUrl, fileType, fileName);
                });

                div.append(playMediaBtn);

                td5.append(div);
                tr.append(td5);
                folderListTbody.append(tr);
            }
        }   else {
            console.log("No contents available.");
        }
    } catch (error) {
        console.error("Error fetching folder contents:", error);
    }
}

async function editMedia(formData) {
    try {
        const response = await fetch('http://127.0.0.1:3000/editMedia', {
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
                checkBox.val(content.filename);
                checkBox.attr('name', 'selectedFiles');
                td.append(checkBox);
                tr.append(td);

                const deleteButton = $('#deleteSelections');

                checkBox.on('change', function() {
                    if ($('input[name="selectedFiles"]:checked').length > 0) {
                        deleteButton.css("visibility", "visible");
                    } else {
                        deleteButton.css("visibility", "hidden");
                    }
                });

                deleteButton.on('click', function() {
                    const selectedFiles = $('input[name="selectedFiles"]:checked').map(function() {
                        return $(this).val();
                    }).get();
    
                    // Now 'selectedFiles' is an array containing the values of the checked checkboxes
                    // Implement your logic to delete these files here
                    for (let i = 0; i < selectedFiles.length; i++) {
                        const fileName = selectedFiles[i];
                        const formData = new FormData();
                        formData.append('filename', fileName);
                        formData.append('playlistname', currentPlaylistName);
                        deleteMedia(formData);
                    }
    
                    console.log('Selected files:', selectedFiles);
                });
          
                const td2 = $('<td>');
                td2.addClass("fileDesc");
                td2.text(content.filename);
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
            
                const playMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.filename}">
                    <span>
                    <img src="../assets/img/mediaManagement/play-circle.svg" alt="Play" width="25">
                    </span>
                </button>`);
            
                playMediaBtn.on('click', function (event) {
                    event.preventDefault();
                    const fileUrl = "uploads/" + content.foldername + "/" + content.filename;
                    const fileName = content.filename;
                    const fileType = fileName.substr((fileName.lastIndexOf('.') + 1));
                    console.log(fileUrl + "  " + fileType);
                    displayInModal(fileUrl, fileType, fileName);
                });
            
                const deleteMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.filename}">
                    <span>
                    <img src="../assets/img/mediaManagement/trash-can.svg" alt="Trash Can" width="25">
                    </span>
                </button>`);
            
                deleteMediaBtn.on('click', function (event) {
                    event.preventDefault();
                    const fileName = $(this).data('media');
                    console.log(fileName);
                    const formData = new FormData();
                    formData.append('filename', fileName);
                    formData.append('playlistname', currentPlaylistName);
                    deleteMedia(formData);
                });

                const editMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.filename}">
                                                <span>
                                                    <img src="../assets/img/mediaManagement/message-edit.svg" alt="Edit" width="25">
                                                </span>
                                            </button>`);
                                            
                    editMediaBtn.on('click', function (event) {
                        editMediaModal();
                    });

                    

                $("#folderOptionsForm").on("submit", function(event) {
                    event.preventDefault();
                    updateFolder(currentPlaylistName, fileName);
                });
            
                div.append(playMediaBtn);

                // Add a separator between buttons
                div.append('<div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>');

                div.append(editMediaBtn);
                
                // Add a separator between buttons
                div.append('<div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>');
            
                div.append(deleteMediaBtn);
            
                td5.append(div);
                tr.append(td5);
                playlistTbody.append(tr);
            });
        }
    } catch (error) {
        console.error('Error fetching playlist contents:', error);
    }
}

function editMediaModal() {
    const modal = $('#editMedia');
    modal.modal('show');
}

async function deleteMedia(formData) {
    try {
        const response = await fetch('http://127.0.0.1:3000/deleteMedia', {
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
    const modal = $('#mediaModal');
    const modalContent = $('#mediaModalContent');
    modalContent.empty();
    modalContent.append(`<div class="modal-header">
                            <h1 class="modal-title fs-5" id="mediaNameLabel"></h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>`);   
    const mediaNameLabel = $('#mediaNameLabel');
    mediaNameLabel.text(fileName);
    
    // Create appropriate element based on file type
    if (fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg") || fileType.startsWith("jepg") || fileType.startsWith("webp")) {
        const imgElement = $('<img>')
            .attr("src", '../../' + fileUrl);
        modalContent.append(imgElement);
    } else if (fileType.startsWith("mp4") || fileType.startsWith("mkv") || fileType.startsWith("mov") || fileType.startsWith("wmv")) {
        const videoElement = $('<video>').attr('controls', true);
        const sourceElement = $('<source>').attr('src', '../../' + fileUrl).attr('type', fileType);
        videoElement.append(sourceElement);
        modalContent.append(videoElement);
    }

    modal.modal('show');
}