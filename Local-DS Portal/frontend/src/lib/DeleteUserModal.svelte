<!-- src/lib/DeleteUserModal.svelte -->
<script>
    export let user;

    import { onMount } from 'svelte';
    import { deleteUser } from '../apis/adminApis';

    let delEmail = '';

    let delUser = {
      name: '',
      lastname: '',
      mainUserDegree: '',
      email: '',
      phoneNumber: '',
      backupName: '',
      backupLastname: '',
      backUserDegree: '',
      backupPhoneNumber: '',
      companyName: '',
      companyAddress: '',
      numberOfScreens: '',
      password: ''
    };

    $: {
      if (user) {
        delUser = { ...user };
      }
    }

    // Call the resetModal function when the modal is opened
    onMount(() => {
      resetModal();
    });

    function resetModal() {
        delUser = { ...user };
    }

    function deleteUserC(event) {
      deleteUser(delUser._id);
    }
</script>

<div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteUserModalLabel">Kullanıcı Sil</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <h1 class="modal-title fs-5" id="deleteUserModalLabel">Kullanıcıyı silmek istediğinize emin misiniz?</h1>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
            <button type="submit" class="btn btn-danger" data-bs-dismiss="modal" on:click={deleteUserC}>Sil</button>
          </div>
      </div>
    </div>
</div>