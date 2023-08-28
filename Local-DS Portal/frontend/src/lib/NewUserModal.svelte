<!-- src/lib/NewUserModal.svelte -->
<script>
    import { registerUser } from "../apis/adminApis.js";

    let name = "";
    let lastname = "";
    let mainUserDegree = "";
    let email = "";
    let phoneNumber = "";
    let backupName = "";
    let backupLastname = "";
    let backUserDegree = "";
    let backupPhoneNumber = "";
    let companyName = "";
    let companyAddress = "";
    let numberOfScreens = "";
    let password = "";

    async function handleRegisterUser(event) {
        event.preventDefault();
        try {
          const userData = await registerUser(name, 
                                   lastname,  
                                   mainUserDegree, 
                                   email, 
                                   phoneNumber, 
                                   backupName, 
                                   backupLastname, 
                                   backUserDegree, 
                                   backupPhoneNumber, 
                                   companyName, 
                                   companyAddress, 
                                   numberOfScreens, 
                                   password);
          console.log(userData);
          
        } catch (error) {
            // Handle error
        }
    }
</script>

<div class="modal fade" id="newUserModal" tabindex="-1" aria-labelledby="newUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="newUserModalLabel">New User</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <input type="text" id="name" class="form-control mb-2" placeholder="Name" bind:value={name} >
            <input type="text" id="lastname" class="form-control mb-2" placeholder="Last Name" bind:value={lastname}>
            <input type="text" id="degree" class="form-control mb-2" placeholder="Main User Degree" bind:value={mainUserDegree}>
            <input type="email" id="email" class="form-control mb-2" placeholder="Email" bind:value={email}>
            <input type="number" id="phone" class="form-control mb-2" placeholder="Phone Number" bind:value={phoneNumber}>
            <input type="text" id="b-name" class="form-control mb-2" placeholder="Backup User Name" bind:value={backupName}>
            <input type="text" id="b-lastname" class="form-control mb-2" placeholder="Backup User Last Name" bind:value={backupLastname}>
            <input type="text" id="b-degree" class="form-control mb-2" placeholder="Backup User Degree" bind:value={backUserDegree}>
            <input type="number" id="b-phone" class="form-control mb-2" placeholder="Backup User Phone Number" bind:value={backupPhoneNumber}>
            <input type="text" id="company-name" class="form-control mb-2" placeholder="Company Name" bind:value={companyName}>
            <input type="text" id="company-address" class="form-control mb-2" placeholder="Company Address" bind:value={companyAddress}>
            <input type="number" id="num-screens" class="form-control mb-2" placeholder="Number of Screens" bind:value={numberOfScreens}>
            <input type="text" id="password" class="form-control mb-2" placeholder="Company Name" bind:value={password}>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" on:click={handleRegisterUser}>Save</button>
          </div>
      </div>
    </div>
</div>