<!-- src/adminUserList.svelte -->
<script>
    import Navbar from "./lib/Navbar.svelte";
    import NewUserModal from "./lib/NewUserModal.svelte";
    import EditUserModal from "./lib/EditUserModal.svelte";
    import { fetchUsers } from './apis/adminApis';

    let users = [];

    async function loadUsers() {
        try {
            users = await fetchUsers();
        } catch (error) {
            console.error(error);
        }
    }

    loadUsers();
</script>

<Navbar />
<NewUserModal />

<div class="container-fluid px-5" style="margin-top: -5rem">
    <div class="container-fluid rounded-4 bg-light py-4" id="userListDiv">
        <div class="row d-flex justify-content-between px-4 mb-4">

            <div class="col d-flex align-items-center">
            <i class="bi bi-list-ul fs-4"></i>
            <h4 class="mb-0 ms-1 fw-bold">User List</h4>
            </div>

            <div class="col d-flex align-items-center justify-content-end">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newUserModal">
                <i class="bi bi-plus text-white"></i>
                Register New User
            </button>
            </div>

        </div>

        <div class="border rounded-3 p-3" id="userList">
            <table class="table rounded-3 table-light">
              <thead id="table-thead">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">Num of Screens</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody id="table-tbody">
                {#each users as user, index}
                <tr>
                    <th>{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.lastname}</td>
                    <td>{user.companyName}</td>
                    <td>{user.numberOfScreens}</td>
                    <td>
                        <button type="button" class="btn shadow-none" data-bs-toggle="modal" data-bs-target="#editUserModal">
                            <i class="bi bi-three-dots"></i>
                        </button>
                    </td>
                </tr>
                {/each}
              </tbody>
            </table>
        </div>
    </div>
</div>