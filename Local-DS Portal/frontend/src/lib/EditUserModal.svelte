<!-- src/lib/EditUserModal.svelte -->
<script>
    export let user;

    let editedUser = {
      name: user.name,
      lastname: user.lastname,
      mainUserDegree: user.mainUserDegree,
      email: user.email,
      phoneNumber: user.phoneNumber,
      backupName: user.backupName,
      backupLastname: user.backupLastname,
      backUserDegree: user.backUserDegree,
      backupPhoneNumber: user.backupPhoneNumber,
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      numberOfScreens: user.numberOfScreens,
      password: user.password
    };

    function updateUserInfo(event) {
      // Update editedUser properties based on user input
      editedUser[event.target.name] = event.target.value;
    }

    function saveChanges() {
    // Handle saving changes and sending editedUser data to backend
  }

</script>

<div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editUserModalLabel">New User</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <input type="text" id="name" class="form-control mb-2" placeholder="Name" bind:value={editedUser.name} >
            <input type="text" id="lastname" class="form-control mb-2" placeholder="Last Name" bind:value={editedUser.lastname}>
            <input type="text" id="degree" class="form-control mb-2" placeholder="Main User Degree" bind:value={editedUser.ainUserDegree}>
            <input type="email" id="email" class="form-control mb-2" placeholder="Email" bind:value={editedUser.email}>
            <input type="number" id="phone" class="form-control mb-2" placeholder="Phone Number" bind:value={editedUser.phoneNumber}>
            <input type="text" id="b-name" class="form-control mb-2" placeholder="Backup User Name" bind:value={editedUser.backupName}>
            <input type="text" id="b-lastname" class="form-control mb-2" placeholder="Backup User Last Name" bind:value={editedUser.backupLastname}>
            <input type="text" id="b-degree" class="form-control mb-2" placeholder="Backup User Degree" bind:value={editedUser.backUserDegree}>
            <input type="number" id="b-phone" class="form-control mb-2" placeholder="Backup User Phone Number" bind:value={editedUser.backupPhoneNumber}>
            <input type="text" id="company-name" class="form-control mb-2" placeholder="Company Name" bind:value={editedUser.companyName}>
            <input type="text" id="company-address" class="form-control mb-2" placeholder="Company Address" bind:value={editedUser.companyAddress}>
            <input type="number" id="num-screens" class="form-control mb-2" placeholder="Number of Screens" bind:value={editedUser.numberOfScreens}>
            <input type="text" id="password" class="form-control mb-2" placeholder="Company Name" bind:value={editedUser.password}>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" on:click={saveChanges}>Save</button>
          </div>
      </div>
    </div>
</div>