async function createFolder(folderName) {

    var folderName = document.getElementById("folderName").value;
    var folderList = document.getElementById("folderList");
    if (folderName) {
        fetch(`/createFolder?folderName=${folderName}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var folderElement = document.createElement("button");
                folderElement.classList.add("btn");
                folderElement.classList.add("btn-secondary");
                folderElement.classList.add("mb-3");
                folderElement.classList.add("d-flex");
                folderElement.classList.add("folder-button");

                folderElement.innerHTML =   "<i class='bi bi-folder me-2'></i>" +
                                            "<span class='folder'>"+ folderName +"</span>";
                folderElement.onclick = function () {
                    
                };
                folderList.appendChild(folderElement);
            } else {
                alert("Folder creation failed.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}

async function fetchFolders() {
    const folderList = document.getElementById("folderList");
    folderList.innerHTML = "";

    fetch('/getFolders')
        .then(response => response.json())
        .then(data => {

            // Adding a button to show files not in any folder
            const uploadsBaseFiles = document.createElement('button');
            uploadsBaseFiles.classList.add("btn");
            uploadsBaseFiles.classList.add("btn-outline-secondary");
            uploadsBaseFiles.classList.add("mb-3");
            uploadsBaseFiles.classList.add("d-flex");
            uploadsBaseFiles.setAttribute("data-folder", "Uploads Base");
            uploadsBaseFiles.textContent = '../';
            uploadsBaseFiles.addEventListener('click', () => {
                showUploadsBaseContents();
            });
            folderList.appendChild(uploadsBaseFiles);

            data.folders.forEach(folderName => {
                const folder = document.createElement("button");
                folder.classList.add("btn");
                folder.classList.add("btn-outline-secondary");
                folder.classList.add("mb-3");
                folder.classList.add("d-flex");
                folder.classList.add("folder-button");
                folder.setAttribute("data-folder", folderName);

                folder.innerHTML =  "<i class='bi bi-folder me-2'></i>" +  
                                    "<span class='folder' id='' >" + folderName + "</span>";
                folderList.appendChild(folder);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

async function uploadFiles(folderName, files, delayTimes) {
    const uploadFolderSelect = document.getElementById('uploadFolderSelect');
    //const filesInput = document.getElementById('fileInput');
    //const fileDelay = Array.from(document.querySelectorAll('#fileDelay'));
    const formData = new FormData();

    // Append the selected folder name to the form data
    formData.append('uploadFolderName', uploadFolderSelect.value);

    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
        formData.append('delayTimes', delayTimes[i]);
    }

    // Upload files using FormData
    fetch('/uploadFiles', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // After successful upload, refresh folder contents
        const folderName = uploadFolderSelect.value;
        showFolderContents(folderName, delayTimes);
        //let folderBtn = document.querySelectorAll('[data-folder=' + folderName + ']');
        //folderBtn.click();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteFile(folderName, fileName) {
    const details = {
        folderName: folderName,
        fileName: fileName
    };

    const formBody = urlEncodeObject(details);

    fetch('/deleteFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    })

    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Refresh the folder contents after successful deletion
            showFolderContents(folderName);
        } else {
            console.error('Delete failed:', data.error);
        }
    })
    .catch(error => {
        console.error('Delete error:', error);
    });
}