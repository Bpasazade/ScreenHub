import { currentPlaylistName } from "./mediaManagement.js";
$(window).on("load", function() {
    fetchFolders();
    var uploadInProgress = false;

    getDeviceStorageInfo(function (storageInfo) {
        console.log('Used storage: ' + storageInfo.usedStorage);
        console.log('Total storage: ' + storageInfo.totalStorage);
      
        // You can use storageInfo.usedStorage and storageInfo.totalStorage here.
    });

    const uploadFileBtn = $("#uploadFileBtn");
    uploadFileBtn.on("click", function(event) {
        event.preventDefault();
        const uploadDiv1 = $("#uploadDiv1");
        const uploadDiv2 = $("#uploadDiv2");
        const uploadDiv21 = $("#uploadDiv2-1");
        const uploadDiv22 = $("#uploadDiv2-2");
        const uploadDiv23 = $("#uploadDiv2-3");
        const fileManagementFileList = $("#fileManagementFileList");
        const foldersDiv = $("#foldersDiv");
        const directboxSend = $("#directbox-send path");
        
        if(uploadFileBtn.hasClass("unchecked")) {
            uploadFileBtn.removeClass("unchecked");
            uploadFileBtn.addClass("checked");

            uploadDiv2.css("display", "flex");
            uploadDiv1.show();
            uploadDiv21.show();
            uploadDiv22.hide();

            uploadDiv23.removeClass("d-flex");
            uploadDiv23.hide();
            
            fileManagementFileList.hide();
            foldersDiv.hide();

            uploadFileBtn.css("background-color", "#04A3DA");
            directboxSend.eq(0).attr("fill", "#FFFFFF");
            directboxSend.eq(1).attr("fill", "#FFFFFF");
            directboxSend.eq(2).attr("fill", "#FFFFFF");
        } else {
            uploadFileBtn.removeClass("checked");
            uploadFileBtn.addClass("unchecked");

            uploadDiv1.hide();
            uploadDiv2.hide();
            fileManagementFileList.show();
            foldersDiv.show();

            uploadFileBtn.css("background-color", "#F3F3F3");
            directboxSend.eq(0).attr("fill", "#04A3DA");
            directboxSend.eq(1).attr("fill", "#25324B");
            directboxSend.eq(2).attr("fill", "#25324B");

        }
        populateFolderDropdown();
        populatePlaylistDropdown();
    });

    function createProgressBar(file) {
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress');
        progressBar.style.height = '6px';
        progressBar.style.borderRadius = '2px';
        progressBar.style.marginBottom = '10px';
      
        const progressBarInner = document.createElement('div');
        progressBarInner.classList.add('progress-bar');
        progressBarInner.style.width = '0%';
        progressBarInner.setAttribute('role', 'progressbar');
      
        progressBar.appendChild(progressBarInner);
      
        return progressBar;
    }


    const ongoingUploadsList = $('#ongoing-uploads');
    const completedUploadsList = $('#completed-uploads');
    const canceledFiles = new Set();
    let uploadsInProgress = new Set();
    var upload = {};

    $('#fileInput').on('change', function (event) {
    
        const uploadDiv22 = $("#uploadDiv2-2");
        const uploadDiv23 = $("#uploadDiv2-3");
        uploadDiv22.show();
        uploadDiv23.show();
        
        ongoingUploadsList.addClass('mx-1');
        const h1 = $('<h1>');
        h1.addClass('text-start mb-1 ms-1');
        h1.css('font-size', '15px');
        h1.css('font-weight', '500');
        h1.css('color', '#3068BC');
        h1.text('Yüklenen Dosyalar');
        ongoingUploadsList.append(h1);

        const files = event.target.files;
      
        for (const file of files) {
          const progressBar = createProgressBar(file);
          upload = {
            id: Math.random().toString(36).substr(2, 9),
            inProgress: true,
          }
        uploadsInProgress.add(upload);

      
          // Create the list item for this file
          const progressTitle = $('<li>').addClass('list-group-item border-0 px-0')
            .html(`<div class="d-flex justify-content-between mb-2">
                        <span class="d-flex align-items-center">
                            <img src="../assets/img/mediaManagement/gallery.svg" alt="Gallery" class="me-2">
                            <p class="text m-0" style="font-size: 14px; font-weight: 500;">${file.name}</p>
                        </span>
                        <span class="d-flex align-items-center cancel-upload" id="cancel-upload">
                            <img src="../assets/img/mediaManagementR/close_small.svg" id="cancel-icon" alt="Cancel" data-file-id="${file.id}">
                        </span>
                    </div>`);


        progressTitle.find('.cancel-upload').on("click", function(event) {
            // const updatedFiles = Array.from(fileInput.files).filter((f) => f !== file);
            // fileInput.files = new FileList(updatedFiles, fileInput.name);
            // Remove the list item
            canceledFiles.add(file);
            progressTitle.remove();
            progressBar.remove();
        });
      
        
        $('#ongoing-uploads').append(progressTitle);
        $('#ongoing-uploads').append(progressBar);

          let progress = 0;
          const progressInterval = setInterval(() => {
            uploadInProgress = true;
            progress += 17;
            if (progress <= 100) {
              updateProgressBar(progressBar, progress);
            } else {
              
              clearInterval(progressInterval);
              progressTitle.remove();
              progressBar.remove();
              h1.remove();

              if (!canceledFiles.has(file)) {
                upload.inProgress = false;
                progressTitle.find('#cancel-icon').attr('src', '../assets/img/mediaManagementR/trash-can.svg');
                completedUploadsList.append(progressTitle);
                progressTitle.find('#cancel-icon').on('click', function () {
                    canceledFiles.add(file);
                    progressTitle.remove();
                });
              }
            }
          }, 500);
        }
      });

      $('#cancel-button').on('click', function () {
        ongoingUploadsList.empty();
        canceledFiles.clear();
        upload.inProgress = false;
        completedUploadsList.empty();
    });
        
        $('#save-button').on('click', function (event) {
            const falses = Array.from(uploadsInProgress).filter((upload) => !upload.inProgress);
            console.log(falses);
            if (!falses) {
                alert('Upload operation in progress. Wait for it to complete.');
                return;
            }
            const filesToSave = Array.from(fileInput.files).filter((file) => !canceledFiles.has(file));
            
            if (filesToSave.length === 0) {
                alert('No files to save.');
                return;
            }
    
            const formDataFolder = new FormData();
            const formDataPlaylist = new FormData();
            for (let i = 0; i < filesToSave.length; i++) {
                if(filesToSave[i].type.startsWith("video")) {  
                    const duration = getVideoDuration(filesToSave[i]);
                    console.log(duration);
                    formDataFolder.append('duration', duration);
                    formDataPlaylist.append('duration', duration);
                }
                formDataFolder.append('uploadedFiles', filesToSave[i]);
                formDataPlaylist.append('selectedFile', filesToSave[i]);

            }
            formDataFolder.append('uploadFolderName', $("#uploadFolderSelect").val());
            formDataPlaylist.append('uploadPlaylistName', $("#uploadPlaylistSelect").val());
            formDataPlaylist.append('folderName', $("#uploadFolderSelect").val()); 
            
            uploadFiles(formDataFolder);
            if($("#uploadPlaylistSelect").val() != "(İsteğe Bağlı))")
                addContentToPlaylist(formDataPlaylist);

            completedUploadsList.empty();
        });

    function updateProgressBar(progressBar, progress) {
      const progressBarInner = progressBar.querySelector('.progress-bar');
      progressBarInner.style.width = progress + '%';
      progressBarInner.setAttribute('aria-valuenow', progress);
    }

    $('#baseFolderBtn').on('click', function () {
        showUploadsBaseContents();
    });

    $("#folderForm").on("submit", function(event) {
        event.preventDefault();
        const folderName = $("#folderName").val();
        const folderColor = $("#folderColor").val();
        console.log(folderName + " " + folderColor);
        createFolder(folderName, folderColor);
    });

    $("#folderList").on("click", ".folder-button, .folder-options-btn ", async function (event) {
        const target = $(event.target);
        if (target.hasClass("folder-button")) {
            const folderName = target.data("folder");
            showFolderContents(folderName);
        } else if (target.hasClass('folder-options-btn')) {
            const folderName = target.data('folder');
        }
    });
});

async function addContentToPlaylist(formdata) {
    try {
        const response = await fetch('http://127.0.0.1:3000/addMediaToPlaylist', {
            method: 'POST',
            body: formdata
        });

        const data = await response.json();
        if (data.success) {
            console.log("Media added to playlist.");
        } else {
            console.error('Upload failed:', data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

function getVideoDuration(file) {
    const videoPlayer = document.createElement('video');
    // Create a blob URL from the video file
    const blobURL = URL.createObjectURL(file);
  
    // Set the video source to the blob URL
    videoPlayer.src = blobURL;
    let duration = 0;
    // Listen for the 'loadedmetadata' event to ensure the video metadata is loaded
    videoPlayer.addEventListener('loadedmetadata', function () {
      // Access the video duration
      duration = videoPlayer.duration;
  
      // You can use the 'duration' here (in seconds)
      console.log('Video duration:', duration);
  
      // Optionally, release the blob URL when done
      URL.revokeObjectURL(blobURL);
    });
    return duration;
  }

async function updateFolder(folderNameOptions, folderName, folderColor) {
    try {
        const response = await $.ajax({
            url: 'http://127.0.0.1:3000/updateFolder',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ folderNameOptions, folderName, folderColor }),
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    fetchFolders();
                } else {
                    console.error('Folder update failed:', data.message);
                }
            },
            error: function(error) {
                console.error('Folder update error:', error);
            }
        });
    } catch (error) {
        console.error('Folder update error:', error);
    }
}

async function uploadFiles(formdata) {
    try {
        const response = await $.ajax({
            url: 'http://127.0.0.1:3000/uploadFiles',
            method: 'POST',
            data: formdata,
            processData: false,
            contentType: false,
            success: function (data, textStatus, xhr) {
                if (xhr.status === 200) {
                    if (data.success) {
                        // File upload was successful
                    } else {
                        console.error('Upload failed:', data.message);
                    }
                } else {
                    console.error('Upload failed with status:', xhr.status);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Upload error:', textStatus, errorThrown);
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
    }
}

function createFolder(folderName, folderColor) {
    $.ajax({
        url: 'http://127.0.0.1:3000/createFolder',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ folderName, folderColor }),
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                fetchFolders();
            } else {
                console.error('Folder creation failed:', data.message);
            }
        },
        error: function(error) {
            console.error('Folder creation error:', error);
        }
    });
}

async function fetchFolders() {
    try {
        const response = await fetch('http://127.0.0.1:3000/getFolders');
        const data = await response.json();
        
        if (data.folders) {
            const folderList = $("#folderList");
            for (let i = 0; i < data.folders.length; i++) {
                const folderIcon = $(`<svg width="85" class="folder-button" height="71" viewBox="0 0 85 71" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                const folderName = data.folders[i];

                const folder = $("<button>")
                    .addClass("btn text-center rounded bg-light d-flex flex-column justify-content-center align-items-center me-4 folder-button")
                    .css("width", "156px")
                    .css("height", "156px")
                    .attr("data-folder", folderName);

                const folderTopLine = $(`<div class="row d-flex justify-content-between align-items-center" style="margin-top: -13px; width: 115%;">
                                                <span class="p-0" style="width: min-content; transform: rotate(90deg);">
                                                    <img src="../assets/img/mediaManagementR/more.svg" alt="Cancel" id="folder-options" data-folder="${folderName}" style="width: 18px; height: 18px; filter: invert(80%)">
                                                </span>
                                                <span class="p-0" style="width: min-content;">
                                                    <img src="../assets/img/mediaManagementR/close_small.svg" alt="Cancel" id="folder-delete" data-folder="${folderName}">
                                                </span>
                                            </div>`)
                                            .addClass('hidden');

                $("#folderOptionsForm").on("submit", function(event) {
                    event.preventDefault();
                    const folderNameOptions = $("#folderNameOptions").val();
                    const folderColor = $("#folderColor").val();
                    console.log(folderName + " " + folderColor);
                    updateFolder(folderNameOptions, folderName, folderColor);
                });
                
                folderTopLine.find('#folder-options').on('click', function () {
                    displayInModalOptions(folderName);
                });

                folderTopLine.find('#folder-delete').on('click', function () {
                    const foldername = folderName;
                    const formData = new FormData();
                    formData.append('foldername', foldername);
                    deleteFolder(formData);
                });

                folder.append(folderTopLine);
                folder.append(folderIcon)
                folder.append(
                        "<p class='text folder-button mb-0 mt-3' style='font-size: 14px; font-weight: 400;' data-folder='" + folderName + "'>" + folderName + "</p>");
                
                folder.hover(function(){
                    folderTopLine.toggleClass('hidden');
                });

                folderList.append(folder);

                $("#deleteFolder").on("click", async () => {
                    let data = new FormData();
                    data.append('foldername', folderName);
                    await deleteFolder(data);
                });
            }
        }
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

function displayInModalOptions(folderName) {
    const modal = $('#folderOptions');
    modal.modal('show');
}

function byte2Hex (n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}


function populateFolderDropdown() {
    const uploadFolderSelect = $("#uploadFolderSelect");
    uploadFolderSelect.empty();
    
    $.ajax({
        url: 'http://127.0.0.1:3000/getFolders',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.folders) {
                data.folders.forEach(function(folderName) {
                    $("<option>")
                        .val(folderName)
                        .text(folderName)
                        .appendTo(uploadFolderSelect);
                });
            }
        },
        error: function(error) {
            console.error('Fetch folders error:', error);
        }
    });
}

function populatePlaylistDropdown() {
    const playlistSelect = $("#uploadPlaylistSelect");

    $.ajax({
        url: 'http://127.0.0.1:3000/getPlaylists',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.playlists) {
                data.playlists.forEach(function(playlistName) {
                    $("<option>")
                        .val(playlistName)
                        .text(playlistName)
                        .appendTo(playlistSelect);
                });
            }
        },
        error: function(error) {
            console.error('Fetch playlists error:', error);
        }
    });
}

async function deleteFolder(formData) {
    try {
        const response = await fetch('http://127.0.0.1:3000/deleteFolder', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            await showFolderContents(folderName);
        } else {
            console.error('Upload failed:', data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

function showUploadsBaseContents() {
    $.ajax({
        url: '/getUploadsBaseFiles',
        method: 'GET',
        dataType: 'json',
        success: contentsData => {
            const tableTbody = $("#table-tbody");
            tableTbody.empty();

            // Render folder contents
            let order = 1;

            // Render files not in any folder
            contentsData.filesNotInFolder.forEach(content => {
                const contentRow = $("<tr>");

                $("<th>")
                    .text(order)
                    .appendTo(contentRow);
                order += 1;

                // Split content name from extension
                const [baseFileName, baseFileExtension] = content.split('.');

                $("<td>")
                    .text(baseFileName)
                    .appendTo(contentRow);

                $("<td>")
                    .text(baseFileExtension)
                    .appendTo(contentRow);

                contentRow.appendTo(tableTbody);
            });
        },
        error: error => {
            console.error('Error fetching files not in folder:', error);
        }
    });
}

let debounceTimer = null;
function followMouse(event) {
    clearTimeout(debounceTimer); // Clear any previous timers
    debounceTimer = setTimeout(() => {
        const imageDivs = $('.imageDiv');
        const imageWidth = imageDivs.width();
        const offsetX = 20; // Adjust the X offset as needed
        const offsetY = 220; // Adjust the Y offset as needed

        imageDivs.css('left', event.clientX - imageWidth - offsetX + 'px');
        imageDivs.css('top', event.clientY - offsetY + 'px');
    }, 0.00000001);
}
  
function showImage(imageDiv, followMouse, folderName, fileName) {
    try {
        const response = fetch(`/getMedia?folderName=${folderName}&fileName=${fileName}`);
        const data = response.json();
        if (data.success) {
            const source = imageDiv.find('source');
            
            imageDiv.css('display', 'block');
            $(document).on('mousemove', followMouse);
            
  
}
  
function hideImage(imageDiv, followMouse) {
  imageDiv.css('display', 'none');
  $(document).off('mousemove', followMouse);
}

async function showFolderContents(folderName) {
    const folderTbody = $('#folder-tbody');
    try {
        const response = await fetch(`http://127.0.0.1:3000/getFolderContents?folderName=${folderName}`);
        const data = await response.json();

        if (data.contents) {
            folderTbody.empty();
            $('.imageDiv').remove();

            for (let i = 0; i < data.contents.length; i++) {
                const content = data.contents[i];

                const fileType = content.fileName.substr((content.fileName.lastIndexOf('.') + 1));

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

                const imageDiv = $('<div>');
                imageDiv.addClass('imageDiv');
                imageDiv.css('display', 'none');
                imageDiv.css('position', 'absolute');
                imageDiv.css('z-index', '1');
                imageDiv.css('border-radius', '5px');
                imageDiv.css('box-shadow', '0px 0px 10px 0px rgba(0,0,0,0.75)');

                let fileTypeStr = "";

                if(fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg") || fileType.startsWith("jpeg") || fileType.startsWith("webp")) {
                    fileTypeStr = "image";
                    const image = $('<img>');
                    // image.attr('src', '../../' + content.filePath);
                    image.css('width', '300px');
                    image.css('height', 'auto');
                    image.css('border-radius', '5px');
                    image.name = "image";

                    imageDiv.append(image);
                } else {
                    fileTypeStr = "video";
                    const video = $('<video>');
                    video.attr('id', 'video' + i);
                    video.attr('loop', 'true');
                    video.attr('muted', 'true');
                    video.css('width', '300px');
                    video.css('height', 'auto');
                    video.css('border-radius', '5px');

                    const source = $('<source>');
                    // source.attr('src', '../../' + content.filePath);
                    source.attr('type', 'video/' + fileType);
                    source.name = "source";
                    video.append(source);

                    console.log(video);

                    imageDiv.append(video);
                }
                $('body').append(imageDiv);

                const td2 = $('<td>');
                td2.addClass("fileDesc");
                const td2a = $('<a>');
                td2a.attr('href', '#');
                td2a.text(content.fileName);

                let video = document.getElementById('video' + i);
                td2.on('mouseenter', function () {
                    if (video) {
                        video.play();
                    }
                    showImage(imageDiv, followMouse, folderName, content.fileName);
                });

                td2.on('mouseleave', function () {
                    if (video) {
                        video.pause();
                    }
                    hideImage(imageDiv, followMouse);
                });

                td2.css('text-decoration', 'none');
                td2.text(content.fileName);
                tr.append(td2);

                const td21 = $('<td>');
                td21.addClass("fileDesc");

                const colorBox = $('<div>');
                colorBox.addClass('color-box');
                colorBox.css('background-color', data.color);
                console.log(data.color);
                colorBox.css('width', '20px');
                colorBox.css('height', '20px');
                colorBox.css('border-radius', '5px');
                td21.append(colorBox);
                tr.append(td21);

                const td22 = $('<td>');
                td22.addClass("fileDesc");
                td22.text(fileType);
                tr.append(td22);

                console.log(data);

                let delay = 0;
                if(fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg") || fileType.startsWith("jpeg") || fileType.startsWith("webp")) {
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
                   const fileUrl = "uploads/" + folderName + "/" + content.fileName + "";
                   const fileName = content.fileName;
                   const fileType = fileName.substr((fileName.lastIndexOf('.') + 1));
                   console.log(fileUrl + "  " + fileType);
                   displayInModal(fileUrl, fileType, fileName);
                });

                div.append(playMediaBtn);

                div.append('<div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>');
             
                const deleteMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.fileName}">
                                                <span>
                                                    <img src="../assets/img/mediaManagement/trash-can.svg" alt="Trash Can" width="25">
                                                </span>
                                            </button>`);
             
                deleteMediaBtn.on('click', function (event) {
                   event.preventDefault();
                   const fileName = $(this).data('media');
                   const formData = new FormData();
                   formData.append('filename', fileName);
                   formData.append('foldername', folderName);
                   deleteFile(formData);
                });
             
                div.append(deleteMediaBtn);

                div.append('<div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>');

              const downloadMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.fileName}">
                                                <span>
                                                    <img src="../assets/img/mediaManagement/direct-download.svg" alt="Download" width="25">
                                                </span>
                                            </button>`);

                downloadMediaBtn.on('click', function (event) {
                    event.preventDefault();
                    const fileName = $(this).data('media');
                    const foldername = folderName;
                    getFile(fileName, foldername);
                });

                div.append(downloadMediaBtn);
                
                div.append('<div class="vr" style="width: 2px; color: #DDDDDD; height: 14px; align-self: center;"></div>');

                const editMediaBtn = $(`<button class="btn shadow-0 d-flex justify-content-between align-items-center border-0" data-media="${content.fileName}">
                                            <span>
                                                <img src="../assets/img/mediaManagement/message-edit.svg" alt="Edit" width="25">
                                            </span>
                                        </button>`);

                editMediaBtn.on('click', function (event) {
                    event.preventDefault();
                    const fileName = $(this).data('media');
                    const formData = new FormData();
                    formData.append('filename', fileName);
                    //formData.append('playlistname', currentPlaylistName);
                    //console.log(currentPlaylistName);
                    console.log(fileName);
                    editMedia(fileName, folderName);
                });

                div.append(editMediaBtn);

                td5.append(div);
                tr.append(td5);
                folderTbody.append(tr);
            }
        }   else {
            console.log("No contents available.");
        }
    } catch (error) {
        console.error("Error fetching folder contents:", error);
    }
}

async function editMedia(fileName) {
    console.log(fileName);
    const modal = $('#editFile');
    modal.modal('show');

    $('#editFileForm').on('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        formData.append('filename', fileName);
        editFile(formData);
    });
}

async function editFile(formData) {
    try {
        const response = await fetch('http://:3000/editFile', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            await showFolderContents(folderName);
        } else {
            console.error('Upload failed:', data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}


function getFile(fileName, folderName) {
    $.ajax({
        url: 'http://127.0.0.1:3000/getFile', // Replace with your actual backend endpoint
        type: 'GET', // Adjust the HTTP method as needed (e.g., GET)
        data: { filename: fileName, foldername: folderName },
        success: function (fileData) {
            if (fileData) {
                // File data fetched successfully, trigger download
                downloadFile(fileData);
            } else {
                // Handle the case where the file data couldn't be fetched
                alert('File not found or could not be fetched.');
            }
        },
        error: function (error) {
            // Handle any errors or display an error message to the user
            alert('Error fetching file data.');
        }
    });
}

function downloadFile(fileData) {
    // Assuming 'fileData' is an object containing the file content
    const blob = new Blob([fileData.content], { type: fileData.contentType });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element for the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.fileName;

    // Programmatically trigger the click event to initiate the download
    a.click();

    // Clean up the URL
    window.URL.revokeObjectURL(url);
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

    $('.btn-close').on('click', function () {
        modalContent.empty();
        modal.modal('hide');
    });

    console.log(fileUrl + "  " + fileType);
    
    // Create appropriate element based on file type
    if (fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg") || fileType.startsWith("jpeg") || fileType.startsWith("webp")) {
        const imgElement = $('<img>')
            .attr("src", '../../' + fileUrl);
        modalContent.append(imgElement);
        console.log("image");
    } else if (fileType.startsWith("mp4") || fileType.startsWith("mkv") || fileType.startsWith("mov") || fileType.startsWith("wmv")) {
        const videoElement = $('<video controls>');
        const sourceElement = $('<source>').attr('src', '../../' + fileUrl).attr('type', 'video/' + fileType);
        videoElement.append(sourceElement);
        modalContent.append(videoElement);
    }

    modal.modal('show');
}

async function deleteFile(formData) {
    try {
        const response = await fetch('http://127.0.0.1:3000/deleteFile', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            await showFolderContents(folderName);
        } else {
            console.error('Upload failed:', data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

function getDeviceStorageInfo(callback) {
    // Check if the browser supports the StorageManager API
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(function (estimate) {
        const usageInBytes = estimate.usage;
        const quotaInBytes = estimate.quota;
  
        // Convert bytes to human-readable sizes (e.g., KB, MB, GB)
        const formatSize = function (bytes) {
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          if (bytes === 0) return '0 Byte';
          const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
          return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };
  
        const usedStorage = formatSize(usageInBytes);
        const totalStorage = formatSize(quotaInBytes);
  
        // Create an object to hold the storage information
        const storageInfo = {
          usedStorage: usedStorage,
          totalStorage: totalStorage
        };
  
        // Invoke the callback function with the storage information
        callback(storageInfo);
      });
    } else {
      console.log('StorageManager API not supported in this browser.');
    }
}