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
            for (let i = 0; i < data.length; i++) {
                let name = data[i];
                const contentRow = document.createElement('tr');

                const contentOrder = document.createElement('th');
                contentOrder.textContent = i + 1;
                contentRow.appendChild(contentOrder);

                // Split content name from extension
                const [fileName, fileExtension] = name.split('.');

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
                    data.append('filename', name);

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
                    const fileUrl = `uploads/${folderName}/${name}`;
                    displayInModal(fileUrl, fileExtension, name);
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