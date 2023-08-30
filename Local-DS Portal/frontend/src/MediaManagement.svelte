<!-- src/MediaManagement.svelte -->
<script>
    // Navbar
    import RubuPlusLogoDark from "./assets/rubuplus-logo-dark.svg";
    import settings from "./assets/settings.svg";
    import notification from "./assets/notification-bell.svg";

    // Sidebar
    import search from "./assets/search.svg";
    import dashboard from "./assets/dashboard.svg";
    import mediaManagement from "./assets/media-management.svg";
    import systemInfo from "./assets/system-info.svg";
    import memoryManagement from "./assets/memory-management.svg";
    import fileManagement from "./assets/file-management.svg";
    import accounts from "./assets/accounts.svg";
    import directboxSend from "./assets/directbox-send.svg";
    import folderAdd from "./assets/folder-add.svg";
    import batteryCharge from "./assets/battery-charge.svg";
</script>

<style>
    main {
        height: 100vh;
    }
    #navbar {
        border-bottom: solid 2px #EAEBED !important;
    }
    #sidebar {
        border-right: solid 2px #EAEBED !important;
    }
    #search-addon {
        border-right: none;
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
        padding-left: 0.75rem;
        background-color: #F4F5F6;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;

    }
    #search-form {
        border-left: none;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
        background-color: #F4F5F6;
        padding-left: 0;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
    #search-form:focus {
        box-shadow: none;
        font-weight: 400;
        color: #25324B !important;
    }
    .sidebar-button {
        padding: 0.75rem !important;
        color: #909090;
    }
    .sidebar-button:hover {
        background-color: #04A3DA;
        color: white;
    }
    .sidebar-button:hover > img {
        filter: invert(100%);
    }

    #main-content-div {
        background-color: #F4F5F6;
    }
    .media-content-button {
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
        background-color: #F4F5F6;
    }
</style>

<main>
    <header class="p-4" id="navbar">
        <div class="d-flex justify-content-between">
          <img src="{ RubuPlusLogoDark }" alt="Logo" class=""><br>
          <div class="settingsNotificationDiv">
              <img src="{ settings }" alt="Settings" class="me-3">
              <img src="{ notification }" alt="Notification" class="">
          </div>
        </div>
    </header>
    
    <div class="row d-flex h-100">
        <div class="d-flex flex-column flex-shrink-0" style="width: 320px;" id="sidebar">
            <ul class="nav nav-pills flex-column mb-auto p-4">
              <li class="nav-item">
                <div class="input-group w-100">
                    <span class="input-group-addon align-items-center d-flex" id="search-addon">
                        <img src="{ search }" alt="Search" class="me-2">
                    </span>
                    <input class="form-control border-0" type="search" placeholder="Arama Yap" aria-label="Search" id="search-form">
                </div>
                
              </li>
              <li>
                <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                    <img src="{ dashboard }" alt="Dashboard" class="me-2">
                    Dashboard
                </button>
              </li>
              <li>
                <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                    <img src="{ mediaManagement }" alt="Media Management" class="me-2">
                    Medya Yönetimi
                </button>
              </li>
              <li>
                <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                    <img src="{ systemInfo }" alt="System Info" class="me-2">
                    Sistem Bilgisi
                </button>
              </li>
              <li>
                <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                    <img src="{ memoryManagement }" alt="Memory Management" class="me-2">
                    Bellek Yönetimi
                </button>
              </li>
              <li>
                <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                    <img src="{ fileManagement }" alt="File Management" class="me-2">
                    Dosya Yönetimi
                </button>
              </li>
              <li>
                <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                    <img src="{ accounts }" alt="Accounts" class="me-2">
                    Hesaplar
                </button>
              </li>
            </ul>
            <hr>
            <div class="dropdown">
              <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
                <strong>mdo</strong>
              </a>
              <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                <li><a class="dropdown-item" href="#">New project...</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Sign out</a></li>
              </ul>
            </div>
        </div>
        <div class="col-md" id="main-content-div">
            <div class="row d-flex flex-column p-4">
                <div class="col-md-12 p-5 bg-white rounded">
                    <div class="d-flex justify-content-between">
                        <div class="col-md-6">
                            <button class="btn bg-light me-2 media-content-button">
                                <img src="{ directboxSend }" alt="Directbox Send" class="me-2">
                                Dosya Yükle
                            </button>
                            <button class="btn bg-light me-2 media-content-button">
                                <img src="{ folderAdd }" alt="Folder Add" class="me-2">     
                                Playlist Oluştur
                            </button>
                        </div>

                        <div class="col-md-4 d-flex flex-column pt-1">
                            <div class="d-flex justify-content-between mb-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="align-items-center d-flex" id="emailAddon">
                                        <img src="{ batteryCharge }" alt="Folder Add" class="me-2" width="24" />
                                    </span>
                                    <p class="text m-0">Dahili Hafıza</p>
                                </div>
                                <p class="text m-0">1.2GB/5GB</p>
                            </div>
                            <div class="progress" style="height: 3px">
                                <div class="progress-bar" role="progressbar" style="width: 35%; height: 4px;"></div>
                            </div>
                        </div>
                    </div>
                    <hr style="color: #E6E8EC; height: 1px; border: solid 1px #E6E8EC;">
                </div>
            </div>
        </div>
    </div>

</main>

