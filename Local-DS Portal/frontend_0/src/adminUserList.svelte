<!-- src/adminUserList.svelte -->
<script>
  // You can add any logic or data specific to the admin home page here
</script>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

<!-- NAVBAR -->
<header class="p-3 mb-3 border-bottom bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <div style="width: 32px;">
          <img src="logo.svg" class="img-responsive" alt="logo">
        </div>
  
        <ul class="nav col-12 col-lg-auto mx-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 link-secondary">Home</a></li>
          <li><a href="playlist.html" class="nav-link px-2 link-body-emphasis text-white">Playlist</a></li>
          <li><a href="#" class="nav-link px-2 link-body-emphasis text-white">Management</a></li>
        </ul>
  
        <div class="dropdown text-end">
          <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
          </a>
          <ul class="dropdown-menu dropdown-menu-dark text-small" style="">
            <li><a class="dropdown-item" href="#">New project...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-fluid bg-dark p-5"></div>
</header>

<div class="container-fluid px-5" style="margin-top: -5rem">
    <div class="container-fluid rounded-4 bg-light py-4" id="userListDiv">
        
    </div>
</div>