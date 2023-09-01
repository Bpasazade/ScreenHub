<!-- src/lib/Navbar.svelte -->
<script>
    import RLogo from '../assets/logo.svg'
    import { link } from 'svelte-routing'
</script>

<header class="p-4" id="navbar">
  <div class="d-flex justify-content-between">
    <img src="../assets/img/mediaManagement/rubuplus-logo-dark.svg" alt="Logo" class=""><br>
    <div class="settingsNotificationDiv">
        <img src="../assets/img/mediaManagement/settings.svg" alt="Settings" class="me-3">
        <img src="../assets/img/mediaManagement/notification-bell.svg" alt="Notification" class="">
    </div>
  </div>
</header>