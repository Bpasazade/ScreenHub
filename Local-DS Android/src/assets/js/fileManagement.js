$(window).on("load", function() {
    fetchFolders();

    const existingDropzone = Dropzone.forElement('#dropzone-multi');
    if (existingDropzone) {
        existingDropzone.destroy();
    }

    const dropzoneMulti = new Dropzone('#dropzone-multi', {
        parallelUploads: 2,
        maxFilesize: 10,
        addRemoveLinks: true,
        paramName: 'uploadedFiles',
        autoProcessQueue: false,
        init: function () {
            this.on('success', function (file) {
                successfulUploads++;
                updateSuccessfulUploadsCount();
            });
        }
    });

    function updateSuccessfulUploadsCount() {
        $('#count').text(successfulUploads + "Adet Dosya Yüklendi.");
    }

    const ongoingUploadsList = $('#ongoing-uploads');
    const completedUploadsList = $('#completed-uploads');
    let successfulUploads = 0;

    dropzoneMulti.on('addedfile', function (file) {
        $(file.previewElement).remove();
        ongoingUploadsList.addClass('mx-1');
        const h1 = $('<h1>');
        h1.addClass('text-start mb-1 ms-1');
        h1.css('font-size', '15px');
        h1.css('font-weight', '500');
        h1.css('color', '#3068BC');
        h1.text('Yüklenen Dosyalar');
        ongoingUploadsList.append(h1);
        const listItem = $('<li>').addClass('list-group-item border-0 px-0')
            .html(`<div class="d-flex justify-content-between mb-2">
                        <span class="d-flex align-items-center">
                            <img src="../assets/img/mediaManagement/gallery.svg" alt="Gallery" class="me-2">
                            <p class="text m-0" style="font-size: 14px; font-weight: 500;">${file.name}</p>
                        </span>
                        <span class="d-flex align-items-center">
                            <img src="../assets/img/mediaManagementR/close_small.svg" alt="Cancel" id="cancel-upload" data-file-id="${file.upload.uuid}">
                        </span>
                    </div>
                    <div class="progress" style="height: 6px; border-radius: 2px;" id="file-progress">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>`);

        listItem.appendTo(ongoingUploadsList);

        file.customListItem = listItem;

        listItem.find('#cancel-upload').on('click', function () {
            file.customListItem.remove();
            console.log(file);
            dropzoneMulti.removeFile(file);
        });

        // const formData = new FormData();
        // formData.append('uploadedFiles', file);

        // const uploadFolderName = $("#uploadFolderSelect").val();
        // formData.append("uploadFolderName", uploadFolderName);

        // file.formData = formData;
    });

    dropzoneMulti.on('uploadprogress', function (progress) {
        const progressBar = file.customListItem.find('.progress-bar');

        progressBar.css('width', progress + '%');
        progressBar.attr('aria-valuenow', progress);
    });

    dropzoneMulti.on('success', function () {

        file.customListItem.remove("#file-progress");
        file.customListItem.appendTo(completedUploadsList)
    });

    // Event handler for Dropzone's uploadprogress event
    dropzoneMulti.on('success', function (file, response) {
        console.log(`File uploaded: ${file.name}`);
        console.log('Server response:', response);
        
    });

    $('#cancel-button').on('click', function () {
        dropzoneMulti.removeAllFiles(true);
    });
    
    $('#save-button').on('click', function (event) {
        event.preventDefault();
        $.each(dropzoneMulti.files, function (index, file) {
            console.log(file.success);
            console.log(file.status);
            if (file.upload && file.status === 'success') {
                
                uploadFiles(file.formData);
            }
        });
        if (!isUploadEnabled) {
            // Enable uploads and start the upload process
            isUploadEnabled = true;
            dropzoneMulti.processQueue();
        }
    });

    const uploadFileBtn = $("#uploadFileBtn");

    $("#folderForm").on("submit", function(event) {
        event.preventDefault();
        const folderName = $("#folderName").val();
        createFolder(folderName);
    });

    uploadFileBtn.on("click", function(event) {
        event.preventDefault();
        const uploadDiv1 = $("#uploadDiv1");
        const uploadDiv2 = $("#uploadDiv2");
        const fileManagementFileList = $("#fileManagementFileList");
        const foldersDiv = $("#foldersDiv");
        const directboxSend = $("#directbox-send path");
        
        if(uploadFileBtn.hasClass("unchecked")) {
            uploadFileBtn.removeClass("unchecked");
            uploadFileBtn.addClass("checked");

            uploadDiv1.show();
            uploadDiv2.show();
            uploadDiv2.css("display", "flex");
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

    $("#uploadFilesForm").on("submit", async function(event) {
        event.preventDefault();
        const uploadFolderName = $("#uploadFolderSelect").val();

        const files = $("#uploadedFiles")[0].files;
        const delayInputs = $(".delay-input");
        const delayTimes = delayInputs.map(function() {
            return $(this).val();
        }).get();

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append("uploadedFiles", files[i]);
            data.append(`delay_${i}`, delayTimes[i]);
        }
        data.append("uploadFolderName", uploadFolderName);

        await uploadFiles(data);
    });

    $("#folderList").on("click", ".folder-button, .folder-options-btn ", async function (event) {
        const target = $(event.target);
        if (target.hasClass("folder-button")) {
            const folderName = target.data("folder");
            currentFolderName = target.data("folder");
            showFolderContents(folderName);
        } else if (target.hasClass('folder-options-btn')) {
            const folderName = target.data('folder');
            deleteFolderBtn.data('folder', folderName);
        }
    });

    $("#fileInput").on("change", function(event) {
        const files = event.target.files;
        $("#delayInputs").empty();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            addDelayInput(i, file.name);
        }
    });
});

function createFolder(folderName) {
    $.ajax({
        url: 'http://127.0.0.1:3000/createFolder',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ folderName }),
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
            folderList.empty();
            data.folders.forEach(folderName => {
                const folder = $("<button>")
                    .addClass("btn text-center rounded bg-light d-flex flex-column justify-content-between align-items-center me-4 folder-button")
                    .css("width", "156px")
                    .css("height", "156px")
                    .attr("data-folder", folderName)
                    .html(
                        "<img src='../assets/img/mediaManagement/folder-yellow.svg' alt='Folder Yellow' class='my-auto folder-button' id='folder-yellow' data-folder='" + folderName + "'>" +
                        "<p class='text folder-button' style='font-size: 14px; font-weight: 400;' data-folder='" + folderName + "'>" + folderName + "</p>"
                    );
                
                folderList.append(folder);

                $("#deleteFolder").on("click", async () => {
                    let data = new FormData();
                    data.append('foldername', folderName);
                    await deleteFolder(data);
                });
            });
        }
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
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
        const response = await fetch('/deleteFolder', {
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

async function uploadFiles(formdata) {
    try {
        const response = await $.ajax({
            url: 'http://127.0.0.1:3000/uploadFiles',
            method: 'POST',
            data: formdata,
            dataType: 'json'
        });

        if (response.success) {
            //await showFolderContents(folderName);
        } else {
            console.error('Upload failed:', response.error);
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

async function showFolderContents(folderName) {
    const folderThead = $('#folder-thead');
    const folderTbody = $('#folder-tbody');
    try {
        const response = await fetch(`http://127.0.0.1:3000/getFolderContents?folderName=${folderName}`);
        const data = await response.json();

        if (data.contents) {
            folderTbody.empty();

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

                const td21 = $('<td>');
                td21.addClass("fileDesc");
                td21.text(folderName);
                tr.append(td21);

                const td22 = $('<td>');
                td22.addClass("fileDesc");
                const fileType = content.fileName.substr((content.fileName.lastIndexOf('.') + 1));
                td22.text(fileType);
                tr.append(td22);

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
                folderTbody.append(tr);
            });
        }   else {
            console.log("No contents available.");
        }
    } catch (error) {
        console.error("Error fetching folder contents:", error);
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
        const imgElement = $('<img>').attr('src', fileUrl);
        modalContent.append(imgElement);
    } else if (fileType.startsWith("mp4") || fileType.startsWith("mkv") || fileType.startsWith("mov") || fileType.startsWith("wmv")) {
        const videoElement = $('<video>').attr('controls', true);
        const sourceElement = $('<source>').attr('src', fileUrl).attr('type', fileType);
        videoElement.append(sourceElement);
        modalContent.append(videoElement);
    }

    modal.modal('show');
}

function deleteFile(formData) {
    $.ajax({
        url: '/deleteFile',
        method: 'POST',
        data: formData,
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Refresh folder contents after deletion
                showFolderContents(folderName);
            } else {
                console.error('Delete failed:', response.error);
            }
        },
        error: function(error) {
            console.error('Delete error:', error);
        }
    });
}