<script>
	import { Router, Route } from "svelte-routing";
	import Login from './login.svelte';
  	import AdminHome from "./adminHome.svelte";
	import AdminUserList from "./adminUserList.svelte";
</script>

<main>
  	<Login />
</main>

<Router>
	<Route path="/adminLogin" component={Login} />
	<Route path="/adminHome" component={AdminHome} />
	<Route path="/adminUserList" component={AdminUserList} />
</Router>

<style>
	
</style>