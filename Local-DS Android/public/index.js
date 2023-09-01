document.addEventListener("DOMContentLoaded", function () {
    fetchFolders();

    const createFolderForm = document.getElementById("folderForm");
    const uploadFilesForm = document.getElementById("uploadFilesForm");
    const uploadBtn = document.getElementById("upload");
    const fileInput = document.getElementById("fileInput");
    //const delayInputs = document.getElementById("delayInputs");

    // fileInput.addEventListener("change", function (event) {
    //     const files = event.target.files;
    //     delayInputs.innerHTML = ""; // Clear previous delay inputs

    //     Add delay time input for each selected file
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         const delayInput = document.createElement("input");

    //         const delayLabel = document.createElement("label");
    //         delayLabel.textContent = "Delay Time for: " + file.name;
    //         delayLabel.htmlFor = "fileDelay";
    //         delayInputs.appendChild(delayLabel);

    //         delayInput.classList.add("form-control");
    //         delayInput.classList.add("delay-input");
    //         delayInput.id = "fileDelay";
    //         delayInput.name = "fileDelay";
    //         delayInput.type = "number";
    //         delayInput.name = `delay_${i}`; // Associate delay input with the file
    //         delayInput.placeholder = "Delay Time";
    //         delayInputs.appendChild(delayInput);
    //     }
    // });

    createFolderForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const folderName = createFolderForm.querySelector("#folderName").value;
        createFolder(folderName);
    });

    uploadBtn.addEventListener("click", function (event) {
        event.preventDefault();
        populateFolderDropdown();
    });

    uploadFilesForm.addEventListener("submit", async function (event) {
        const uploadFolderName = document.getElementById("uploadFolderSelect").value;

        // const delayInputs = document.querySelectorAll("input[name^='delay_']");
        // const delayTimes = Array.from(delayInputs).map(input => input.value);

        let data = new FormData();

        const files = event.target.uploadedFiles.files;
        if (files.length != 0) {
            // let i = 0;
            for (const single_file of files) {
                data.append('uploadedFiles', single_file);
                //data.append('delayTimes', delayTimes[i]);
                // i += 1;
            }
        }
        data.append('uploadFolderName', uploadFolderName);

        await uploadFiles(data);
    });

    const folderList = document.getElementById("folderList");
    folderList.addEventListener("click", function (event) {
        if (event.target.classList.contains("folder-button")) {
            const folderName = event.target.getAttribute("data-folder");
            // const delayInputs = document.querySelectorAll('.delay-input');
            // const delayTimes = Array.from(delayInputs).map(input => input.value);
            showFolderContents(folderName);
        }
    });
});

// General function to URL encode an object
function urlEncodeObject(obj) {
    const formBody = Object.keys(obj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join("&");
    return formBody;
}

async function createFolder(folderName) {
    try {
        const response = await fetch('/createFolder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ folderName })
        });
        const data = await response.json();
        if (data.success) {
            /*var folderElement = document.createElement("button");
            folderElement.classList.add("btn");
            folderElement.classList.add("btn-secondary");
            folderElement.classList.add("mb-3");
            folderElement.classList.add("d-flex");
            folderElement.classList.add("folder-button");
            folderElement.innerHTML = "<i class='bi bi-folder me-2'></i>" +
                "<span class='folder'>" + folderName + "</span>";
            folderElement.onclick = function () {

            };
            folderList.appendChild(folderElement);*/
            fetchFolders();
        } else {
            console.error('Folder creation failed:', data.message);
        }
    } catch (error) {
        console.error('Folder creation error:', error);
    }
}

async function fetchFolders() {
    try {
        const response = await fetch('/getFolders');
        const data = await response.json();
        if (data.folders) {
            const folderList = document.getElementById("folderList");
            folderList.innerHTML = "";
            data.folders.forEach(folderName => {
                const folder = document.createElement("button");
                folder.classList.add("btn");
                folder.classList.add("btn-outline-secondary");
                folder.classList.add("mb-3");
                folder.classList.add("d-flex");
                folder.classList.add("folder-button");
                folder.classList.add("justify-content-between");
                folder.setAttribute("data-folder", folderName);

                folder.innerHTML = 
                    "<div>" +
                    "<i class='bi bi-folder me-2 float-start'></i>" +
                    "<span class='folder float-start' id='' >" + folderName + "</span>" +
                    "</div>" +
                    "<div>" +
                    "<i class='bi bi-three-dots float-end btn-primary shadow-none' data-bs-toggle='modal' data-bs-target='#folderOptionsModal' id='folderOptions'></i>" +
                    "</div>";

                folderList.appendChild(folder);

                const deleteFolderBtn = document.getElementById("deleteFolder");
                deleteFolderBtn.addEventListener("click", async () => {
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
        const response = await fetch('/uploadFiles', {
            method: 'POST',
            body: formdata
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

async function populateFolderDropdown() {
    const uploadFolderSelect = document.getElementById("uploadFolderSelect");
    uploadFolderSelect.innerHTML = "";
    try {
        const response = await fetch('/getFolders');
        const data = await response.json();
        if (data.folders) {
            data.folders.forEach(folderName => {
                const option = document.createElement("option");
                option.value = folderName;
                option.textContent = folderName;
                uploadFolderSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Fetch folders error:', error);
    }
}

function showUploadsBaseContents() {
    fetch(`/getUploadsBaseFiles`)
        .then(response => response.json())
        .then(contentsData => {
            const tableTbody = document.getElementById("table-tbody");
            tableTbody.innerHTML = "";

            // Render folder contents
            let order = 1;

            // Render files not in any folder
            contentsData.filesNotInFolder.forEach(content => {
                const contentRow = document.createElement('tr');

                const contentOrder = document.createElement('th');
                contentOrder.textContent = order;
                contentRow.appendChild(contentOrder);
                order += 1;

                // Split content name from extension
                const [baseFileName, baseFileExtension] = content.split('.');

                const fileNameD = document.createElement('td');
                fileNameD.textContent = baseFileName;
                contentRow.appendChild(fileNameD);

                const fileExtensionD = document.createElement('td');
                fileExtensionD.textContent = baseFileExtension;
                contentRow.appendChild(fileExtensionD);

                tableTbody.appendChild(contentRow);
            });
        })
        .catch(error => {
            console.error('Error fetching files not in folder:', error);
        });
}

async function showFolderContents(folderName) {
    try {
        const response = await fetch(`/getFolderContents?folderName=${folderName}`);
        const data = await response.json();

        if (data.contents) {
            console.log(folderName);
            console.log("Folder Contents:", data.contents);

            // UI Folder Content Table
            const tableTbody = document.getElementById("table-tbody");
            tableTbody.innerHTML = "";
            for (let i = 0; i < data.contents.length; i++) {
                let content = data.contents[i];
                const contentRow = document.createElement('tr');

                const contentOrder = document.createElement('th');
                contentOrder.textContent = i + 1;
                contentRow.appendChild(contentOrder);

                // Split content name from extension
                const [fileName, fileExtension] = content.fileName.split('.');

                const fileNameD = document.createElement('td');
                fileNameD.textContent = fileName;
                contentRow.appendChild(fileNameD);

                const fileExtensionD = document.createElement('td');
                fileExtensionD.textContent = fileExtension;
                contentRow.appendChild(fileExtensionD);

                // Delete
                const delFile = document.createElement('td');
                const delFileBtn = document.createElement('button');
                delFileBtn.innerHTML = "<i class='bi bi-trash3' style='color: red'></i>";
                delFileBtn.style = "background: none"
                delFileBtn.style.border = "0px";
                delFileBtn.addEventListener("click", async function () {
                    let data = new FormData();
                    data.append('foldername', folderName);
                    data.append('filename', content.fileName);
                    data.append('file', content);

                    await deleteFile(data);
                });
                delFile.appendChild(delFileBtn);
                contentRow.appendChild(delFile);

                // Display
                const mediaPlay = document.createElement('td');
                const mediaPlayBtn = document.createElement('button');
                mediaPlayBtn.setAttribute("data-bs-target", "#mediaModal");
                mediaPlayBtn.setAttribute("data-bs-toggle", "modal");
                mediaPlayBtn.innerHTML = "<i class='bi bi-play-circle' style='color: blue'></i>";
                mediaPlayBtn.style = "background: none"
                mediaPlayBtn.style.border = "0px";
                mediaPlayBtn.addEventListener("click", function () {
                    const fileUrl = `uploads/${folderName}/${content.fileName}`;
                    console.log(data.contents);
                    displayInModal(fileUrl, fileExtension, content.fileName);
                });
                
                mediaPlay.appendChild(mediaPlayBtn);
                contentRow.appendChild(mediaPlay);

                tableTbody.appendChild(contentRow);
            }


            // showFolderContents(data.contents);
            // showDelayTimes(data.delayTimes);
        } else {
            console.log("No contents available.");
        }
    } catch (error) {
        console.error("Error fetching folder contents:", error);
    }
}

// Example function to display content in a modal
function displayInModal(fileUrl, fileType, fileName) {
    console.log(fileUrl + "  " + fileType);
    const modal = document.getElementById('mediaModal');
    const modalContent = document.getElementById('mediaModalContent');
    const mediaNameLabel = document.getElementById('mediaNameLabel');
    mediaNameLabel.textContent = fileName;

    // Create appropriate element based on file type
    if (fileType.startsWith("jpg") || fileType.startsWith("png") || fileType.startsWith("svg")) {
        const imgElement = document.createElement('img');
        imgElement.src = fileUrl;
        modalContent.appendChild(imgElement);
    } else if (fileType.startsWith("mp4") || fileType.startsWith("mkv") || fileType.startsWith("mov") || fileType.startsWith("wmv")) {
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        const sourceElement = document.createElement('source');
        sourceElement.src = fileUrl;
        sourceElement.type = fileType;
        videoElement.appendChild(sourceElement);
        modalContent.appendChild(videoElement);
    }
}

async function deleteFile(formData) {
    try {
        const response = await fetch('/deleteFile', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            // Refresh folder contents after deletion
            showFolderContents(folderName);
        } else {
            console.error('Delete failed:', data.error);
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}