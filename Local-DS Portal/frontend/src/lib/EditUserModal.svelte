<!-- src/lib/EditUserModal.svelte -->
<script>
    export let user;

    import { onMount } from 'svelte';
    import { updateUser } from '../apis/adminApis';
    import userLogo from '../assets/user.svg';
    import directBoxDefault from '../assets/directbox-default.svg';
    import call from '../assets/call.svg';
    import lock from '../assets/lock.svg';
    import briefcase from '../assets/briefcase.svg';
    import directUp from '../assets/direct-up.svg';
    import television from '../assets/television.svg';
    import subLeft from '../assets/sub_left.svg';
    import done from '../assets/done.svg';

    let editedUser = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      companyName: "",
      companyAddress: "",
      mainUserDegree: "",
      numberOfScreens: "",
    };

    // $: {
    //   if (user) {
    //     editedUser = { ...user };
    //   }
    // }

    // Call the resetModal function when the modal is opened
    onMount(() => {
      resetModal();
    });

    function resetModal() {
      editedUser = { ...user };
    }

    function saveChanges() {
      updateUser(user._id, editedUser)
        .then((data) => {
          // Handle success
          console.log(data);
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    }
</script>

<style>
    .input-group {
    border-radius: 10px;
    border: solid 1px #25324B14;
  }
  input {
    border: solid 1px transparent;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    align-items: center;
    height: 50px;
  }
  input {
    border: none;
    box-shadow: none;
    font-weight: 500;
    font-size: 14px;
  }
  input::placeholder {
    font-family: 'Sophia-Pro-Light', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #25324B !important;
  }
  .form-control:focus {
    box-shadow: none;
    font-weight: 400;
    color: #25324B !important;
  }
  .input-group-addon {
    border-right: none;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
  .form-control {
    font-size: 14px;
  }
  #cancel-button {
    height: 45px; 
    border-color:#BFBFBF33;
    border-radius: 11px; 
    font-weight: 600; 
    font-size: 16px; 
    width: max-content;
  }
  #save-button {
    height: 45px; 
    background-color: #04A3DA; 
    border-radius: 11px; 
    font-weight: 600; 
    font-size: 16px; 
    width: max-content;
  }
</style>

<div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editUserModalLabel">Kullanıcı Düzenle</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <div class="modal-body">
              <!-- Name Lastname -->
              <div class="input-group mb-3" id="name-group">
                <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                  <img src="{ userLogo }" alt="User Logo" width="24" />
                </span>
                <input type="text" id="edit-name" class="form-control ps-0 rounded" placeholder="Adınız/Soyadınız" bind:value={editedUser.name} >
              </div>
  
              <!-- Email -->
              <div class="input-group mb-3" id="email-group">
                <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                  <img src="{ directBoxDefault }" alt="User Logo" width="24" />
                </span>
                <input type="email" id="edit-email" class="form-control ps-0" placeholder="Email" bind:value={editedUser.email}>
              </div>
  
              <!-- Phone Number -->
              <div class="input-group mb-3" id="phone-group">
                <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                  <img src="{ call }" alt="User Logo" width="24" />
                </span>
                <input type="text" id="edit-phone" class="form-control ps-0" placeholder="Telefon Numarası" bind:value={editedUser.phoneNumber}>
              </div>
  
              <div class="row">
                <div class="col">
                  <!-- Password -->
                  <div class="input-group" id="password-group">
                    <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                      <img src="{ lock }" alt="User Logo" width="24" />
                    </span>
                    <input type="password" id="edit-password" class="form-control ps-0" placeholder="Şifre" bind:value={editedUser.password}>
                  </div>
                </div>
                <div class="col">
                  <!-- Verify Password -->
                  <div class="input-group" id="verify-password-group">
                    <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                      <img src="{ lock }" alt="User Logo" width="24" />
                    </span>
                    <input type="password" id="edit-verify-password" class="form-control ps-0" placeholder="Şifre Tekrar" bind:value={editedUser.password}>
                  </div>
                </div>
              </div>
  
              <hr class="my-3" style="color: #25324B14; border: solid 1px #25324B14">
  
              <!-- Company Name -->
              <div class="input-group mb-3" id="company-name-group">
                <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                  <img src="{ briefcase }" alt="User Logo" width="24" />
                </span>
                <input type="text" id="edit-company-name" class="form-control ps-0" placeholder="Şirket İsmi" bind:value={editedUser.companyName}>
              </div>
  
              <!-- Company Address -->
              <div class="input-group mb-3" id="company-address-group">
                <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                  <img src="{ directUp }" alt="User Logo" width="24" />
                </span>
                <input type="text" id="edit-company-address" class="form-control ps-0" placeholder="Şirket Adresi" bind:value={editedUser.companyAddress}>
              </div>
  
              <div class="row">
                <div class="col">
                  <!-- Main User Degree -->
                  <div class="input-group mb-3" id="degree-group">
                    <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                      <img src="{ userLogo }" alt="User Logo" width="24" />
                    </span>
                    <input type="text" id="edit-degree" class="form-control ps-0" placeholder="Unvan" bind:value={editedUser.mainUserDegree}>
                  </div>
                </div>
                <div class="col">
                  <!-- Number of Screens -->
                  <div class="input-group mb-3" id="num-screens-group">
                    <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                      <img src="{ television }" alt="User Logo" width="24" />
                    </span>
                    <input type="number" id="edit-num-screens" class="form-control ps-0" placeholder="Ekran Sayısı" bind:value={editedUser.numberOfScreens}>
                  </div>
                </div>
              </div>
  
            </div>
            <div class="modal-footer">
              <button id="cancel-button" type="submit" class="btn border-2 me-2 px-3" data-bs-dismiss="modal">
                <span class="d-flex align-items-center">
                    İptal Et
                    <img src="{ subLeft }" alt="Trash Can" class="" style="opacity: 30%;">
                </span>
            </button>
            <button id="save-button" type="submit" class="btn btn-primary border-0 px-3" data-bs-dismiss="modal" on:click={saveChanges}>
                <span class="d-flex align-items-center">
                    Kaydet
                    <img src="{ done }" alt="Trash Can" class="">
                </span>
            </button>
          </div>
      </div>
    </div>
  </div>
</div>