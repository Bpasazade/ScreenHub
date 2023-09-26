<!-- src/adminHome.svelte -->
<script>
  // Navbar
  import RubuPlusLogoDark from "./assets/rubuplus-logo-dark.svg";
  import settings from "./assets/settings.svg";
  import notification from "./assets/notification-bell.svg";

  // Sidebar
  import search from "./assets/search.svg";
  import dashboard from "./assets/dashboard.svg";
  import accounts from "./assets/accounts.svg";
  import userImage from "./assets/user-image.svg";
  
  // Main Content


  import { Link } from "svelte-routing";
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
        background-color: #f7f7f7;
    }
</style>

<main class="m-0 p-0">
    <header class="p-4" id="navbar">
        <div class="d-flex justify-content-between">
          <img src="{ RubuPlusLogoDark }" alt="Logo" class=""><br>
          <div class="settingsNotificationDiv">
              <img src="{ settings }" alt="Settings" class="me-3">
              <img src="{ notification }" alt="Notification" class="">
          </div>
        </div>
    </header>
    
    <div class="row d-flex m-0 p-0" style="height: 92vh;">
        <div class="d-flex flex-column flex-shrink-0" style="width: 320px;" id="sidebar">
            <ul class="nav nav-pills flex-column p-4">
              <li class="nav-item">
                <div class="input-group w-100">
                    <span class="input-group-addon align-items-center d-flex" id="search-addon">
                        <img src="{ search }" alt="Search" class="me-2">
                    </span>
                    <input class="form-control border-0" type="search" placeholder="Arama Yap" aria-label="Search" id="search-form">
                </div>     
              </li>
              <li>
                <Link to="/adminDashboard" style="text-decoration: none;">
                    <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                        <img src="{ dashboard }" alt="Dashboard" class="me-2">
                        Dashboard
                    </button>
                </Link>
              </li>
              <li>
                <Link to="/adminAccounts" style="text-decoration: none;">
                    <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                        <img src="{ accounts }" alt="Accounts" class="me-2">
                        Hesaplar
                    </button>
                </Link>
              </li>
            </ul>
            <ul>
                <li>
                    <Link to="/adminScreens" style="text-decoration: none;">
                        <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                            <img src="{ accounts }" alt="Screens" class="me-2">
                            Ekranlar
                        </button>
                    </Link>
                </li>
            </ul>
        </div>
        <div class="col-md px-0" id="main-content-div">
            <div class="row d-flex flex-column px-4 pt-4 mx-0">
                <div class="col-md-12 pt-4 ps-4 rounded mb-4">
                    <div class="d-flex justify-content-start">
                        <div class="d-flex mb-3">
                            <h1 class="text me-4 mb-0" style="font-size: 26px; font-weight: 600;">RubuPlus</h1>
                            <div class="col-md-3 d-flex align-items-center">
                                <h1 class="text py-1 px-3 m-0 rounded-2" style="font-size: 12px; font-weight: 400; background-color: #FFA800;">Admin</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="mb-4" style="color: #E6E8EC; height: 1px; border: solid 1px #e2e4e7;">
                <div class="container mx-0 px-0">
                    <div class="row g-0 d-flex justify-content-between">
                        <div class="col-md bg-white rounded mb-4 p-4" style="height: 430px;">
                            <h1 class="dp-1">0 Kullanıcı</h1>
                        </div>
                        <div class="vr mx-3" style="color: transparent;"></div>
                        <div class="col-md bg-white rounded mb-4 p-4" style="height: 430px;">
                            <h1 class="dp-1">0 Ekran</h1>
                        </div>
                        <div class="vr mx-3" style="color: transparent;"></div>
                        <div class="col-md bg-white rounded mb-4 p-4" style="height: 430px;">
                            
                        </div>
                    </div>
                    <div class="row g-0 d-flex">
                        <div class="col-md bg-white rounded mb-4 py-1" style="height: 250px;">
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>