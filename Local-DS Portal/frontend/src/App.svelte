<script>
  import { Router, Route } from "svelte-routing";
  import Login from './Login.svelte';
  import AdminHome from './adminHome.svelte';
  import AdminUserList from './adminUserList.svelte';
</script>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

<Router>
	<Route path="/login" component={Login} />
	<Route path="/adminHome" component={AdminHome} />
  <Route path="/adminUserList" component={AdminUserList} />
</Router>

<style>

</style>