<script>
  import { Router, Route } from "svelte-routing";
  import Login from './Login.svelte';
  import AdminDashboard from './adminDashboard.svelte';
  import AdminAccounts from './adminAccounts.svelte';
  import UserDashboard from './userDashboard.svelte';

  import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js";
</script>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

<Router>
	<Route path="/login" component={Login} />
	<Route path="/adminDashboard" component={AdminDashboard} />
    <Route path="/adminAccounts" component={AdminAccounts} />
    <Route path="/userDashboard" component={UserDashboard} />
</Router>

<style>
  @font-face {
      font-family: 'Sofia-Pro-Black';
      src: url('./assets/Fonts/Sofia Pro Black Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Black-Italic';
      src: url('./assets/Fonts/Sofia Pro Black Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Bold';
      src: url('./assets/Fonts/Sofia Pro Bold Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Bold-Italic';
      src: url('./assets/Fonts/Sofia Pro Bold Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-ExtraLight';
      src: url('./assets/Fonts/Sofia Pro ExtraLight Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-ExtraLight-Italic';
      src: url('./assets/Fonts/Sofia Pro ExtraLight Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Light';
      src: url('./assets/Fonts/Sofia Pro Light Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Light-Italic';
      src: url('./assets/Fonts/Sofia Pro Light Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Medium';
      src: url('./assets/Fonts/Sofia Pro Medium Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Medium-Italic';
      src: url('./assets/Fonts/Sofia Pro Medium Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Regular';
      src: url('./assets/Fonts/Sofia Pro Regular Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Regular-Italic';
      src: url('./assets/Fonts/Sofia Pro Regular Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-SemiBold';
      src: url('./assets/Fonts/Sofia Pro SemiBold Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-SemiBold-Italic';
      src: url('./assets/Fonts/Sofia Pro SemiBold Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Thin';
      src: url('./assets/Fonts/Sofia Pro Thin Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-Thin-Italic';
      src: url('./assets/Fonts/Sofia Pro Thin Italic Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-UltraLight';
      src: url('./assets/Fonts/Sofia Pro UltraLight Az.otf') format('opentype');
  }
  @font-face {
      font-family: 'Sofia-Pro-UltraLight-Italic';
      src: url('./assets/Fonts/Sofia Pro UltraLight Italic Az.otf') format('opentype');
  }
  :global(body) {
	  padding: 0;
      font-family: 'Sofia-Pro-Regular', sans-serif !important;
  }
</style>