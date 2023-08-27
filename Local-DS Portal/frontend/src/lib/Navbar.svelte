<!-- src/lib/Navbar.svelte -->
<script>
    import RLogo from '../assets/logo.svg'
    import { link } from 'svelte-routing'
</script>

<header class="p-3 mb-3 border-bottom bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <div style="width: 32px;">
          <img src="{RLogo}" class="img-responsive" alt="logo">
        </div>
  
        <ul class="nav col-12 col-lg-auto mx-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="javascript;" use:link={{ to: '/adminHome' }} class="nav-link px-2 link-secondary">Home</a></li>
          <li><a href="javascript;" use:link={{ to: '/adminUserList' }} class="nav-link px-2 link-body-emphasis text-white">Users</a></li>
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