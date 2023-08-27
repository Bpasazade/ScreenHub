<!-- src/adminHome.svelte -->
<script>
  import Navbar from './lib/Navbar.svelte'
</script>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

<Navbar />

<div class="container-fluid px-5" style="margin-top: -5rem">
  <div class="container-fluid rounded-4 bg-light py-4">

    <div class="d-grid gap-3 px-4" style="grid-template-columns: 1fr 1fr;">
      <div class="bg-body-tertiary border rounded-3 d-flex flex-column p-3 bg-white" id="activeUser">
        <h1 class="display-6">0</h1>
        <p class="fs-4">Active User</p>
      </div>
      <div class="bg-body-tertiary border rounded-3 p-3" id="activeScreen">
        <h1 class="display-6">0</h1>
        <p class="fs-4">Active Screen</p>
      </div>
    </div>
  </div>
</div>