<!-- src/Login.svelte -->
<script>
    import RubuPlusLogo from './assets/logo.png'
    import { signIn } from "./apis/userApis.js";
    import { navigate } from 'svelte-routing';

    let email = "";
    let password = "";
  
    async function handleLogin(event) {
      event.preventDefault();
      try {
        const userData = await signIn(email, password);
        console.log(userData);
        // Handle successful login
        if (userData.roles.includes("ROLE_ADMIN")) {
            console.log("Admin user");
            // Navigate to the AdminHome page
            //window.location.href = '/adminHome';
            navigate('/adminHome');
        } else {
            // Handle non-admin user
        }
      } catch (error) {
      // Handle error, show error message to user
      }
    }
</script>

<style>
	:global(body) {
		padding: 0;
	}
</style>

<div class="bg-black d-flex justify-content-center align-items-center p-0" style="min-height: 100vh;">
  <div class="card" style="max-width: 400px;">
    <div class="card-header px-2 py-3">
      <img src="{RubuPlusLogo}" alt="RubuPlus logo" width="200" />
    </div>
    <div class="card-body">
      <h5 class="card-title">Login</h5>
      <p class="card-text">Please enter your email and password to login.</p>
        <div class="mb-3">
          <label for="inputEmail" class="form-label">Email</label>
          <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" bind:value={email} />
        </div>
        <div class="mb-3">
          <label for="inputPassword" class="form-label">Password</label>
          <input type="password" class="form-control" id="inputPassword" bind:value={password} />
        </div>
        <button type="submit" class="btn btn-primary" on:click={handleLogin}>Sign In</button>
    </div>
  </div>
</div>

