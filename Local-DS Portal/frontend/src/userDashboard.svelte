<!-- src/userDashboard.svelte -->
<script>
    // Navbar
    import RubuPlusLogoDark from "./assets/rubuplus-logo-dark.svg";
    import settings from "./assets/settings.svg";
    import notification from "./assets/notification-bell.svg";
  
    // Sidebar
    import search from "./assets/search.svg";
    import dashboard from "./assets/dashboard.svg";
    import logout from "./assets/logout.svg";
    import profile from "./assets/profile.svg";
    import lifebuoy from "./assets/lifebuoy.svg";
    
    // Main Content
    import { Link } from "svelte-routing";
    import { getUser } from "./apis/userApis";
    import jwt_decode from "jwt-decode";
    var decoded = {
        id: null,
        ait: null,
        exp: null
    }
    decoded = jwt_decode(localStorage.getItem("accessToken"));
    console.log(decoded.id);
    var user = {
        companyName: null,
        numberOfScreens: null
    }
    async function getTheUser() {
        user = await getUser(decoded.id);
        console.log(user);
    }
    getTheUser();

    // Lib
    import { signOut } from "./apis/userApis";
    import { navigate } from 'svelte-routing';

    async function signOutUser() {
        try {
            await signOut();
            localStorage.removeItem('accessToken');
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
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
      ul {
        list-style-type: none;
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
          <div class="d-flex flex-column flex-shrink-0 justify-content-between" style="width: 320px;" id="sidebar">
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
                  <Link to="/userDashboard" style="text-decoration: none;">
                      <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                          <img src="{ dashboard }" alt="Dashboard" class="me-3">
                          <p class="text m-0">Dashboard</p>
                      </button>
                  </Link>
                </li>
              </ul>
              <ul class="mb-4 p-4">
                <li>
                    <Link to="/userDashboard" style="text-decoration: none;">
                        <button class="btn sidebar-button mt-3 w-100 text-start d-flex align-items-middle" type="button">
                            <img src="{ lifebuoy }" alt="Dashboard" class="me-3">
                            <p class="text m-0">Destek</p>
                        </button>
                    </Link>
                    
                    <hr class="mb-3" style="color: #E6E8EC; height: 1px; border: solid 1px #D9D9D9;">
                    <Link to="/login" style="text-decoration: none;">
                        <div class="d-flex justify-content-between align-items-center">
                            <img src="{ profile }" alt="User" class="me-3">
                            <div class="d-flex flex-column justify-content-between align-items-start">
                                <p class="text-black m-0">{ user.name } { user.lastname }</p>
                                <p class="text-secondary m-0" style="font-size: 13px; font-weight:300;">{ user.email }</p>
                            </div>
                            
                            <button class="btn text-start d-flex align-items-middle" type="button"  on:click="{ signOutUser }">
                                <img src="{ logout }" alt="Screens" class="me-2">
                            </button>
                        </div>
                    </Link>
                </li>
            </ul>
          </div>
          <div class="col-md px-0" id="main-content-div">
              <div class="row d-flex flex-column px-4 pt-4 mx-0">
                  <div class="col-md-12 pt-4 ps-4 rounded mb-4">
                      <div class="d-flex justify-content-start">
                          <div class="d-flex mb-3">
                            {#if user.companyName}
                                <h1 class="text me-4 mb-0" style="font-size: 26px; font-weight: 600;">{user.companyName}</h1>
                            {/if}
                              <div class="col-md-3 d-flex align-items-center">
                                  <h1 class="text py-1 px-3 m-0 rounded-2" style="font-size: 12px; font-weight: 400; background-color: #04A3DA;">User</h1>
                              </div>
                          </div>
                      </div>
                  </div>
  
                  <hr class="mb-4" style="color: #E6E8EC; height: 1px; border: solid 1px #e2e4e7;">
                  <div class="container mx-0 px-0">
                      <div class="row g-0 d-flex justify-content-between">
                          <div class="col-md bg-white rounded mb-4 p-4" style="height: 430px;">
                            {#if user.numberOfScreens}
                              <h1 class="dp-1">{user.numberOfScreens}</h1>
                            {/if}
                          </div>
                          <div class="vr mx-3" style="color: transparent;"></div>
                          <div class="col-md bg-white rounded mb-4 p-4" style="height: 430px;">
                              
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