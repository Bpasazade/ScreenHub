<!-- src/Login.svelte -->
<script>
    import { signIn } from "./apis/userApis.js";
    import { navigate } from 'svelte-routing';
    import RubuPlusLogo from './assets/rubuplus-logo.svg'
    import plus from './assets/plus.svg'
    import leftImage from './assets/AdobeStock_220567648.png'
    import userLogo from './assets/user.svg'
    import smartLock from './assets/smart-lock.svg'

    let email = "";
    let password = "";
  
    async function handleLogin(event) {
      event.preventDefault();
      try {
        const userData = await signIn(email, password);
        const accessToken = userData.accessToken;
        localStorage.setItem("accessToken", accessToken);
        if (userData.roles.includes("ROLE_ADMIN")) {
            navigate('/adminDashboard');
        } else {
            navigate('/userDashboard');
        }
      } catch (error) {
        // Handle error, show error message to user
      }
    }
</script>

<style>
  .login-container {
      display: flex;
      min-height: 100vh;
  }
  .login-left {
      background-color: #1C2731;
      color: white;
      flex: 1;
      display: flex;
      justify-content: center;
  }
  .login-right {
      flex: 2;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  }
  #emailInputGroup, #passwordInputGroup {
    border-radius: 0.25rem;
    border: solid 1px #25324B14;
  }
  #inputEmail, #inputPassword {
    border: none;
    display: flex;
    align-items: center;
    height: 50px;
  }
  #inputEmail::placeholder, #inputPassword::placeholder {
    font-weight: 400;
    font-size: 14px;
    color: #25324B !important;
  }
  .form-control:focus {
    box-shadow: none;
    font-weight: 400;
    color: #25324B !important;
  }
  #emailAddon, #passwordAddon {
    border-right: none;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
</style>

<div class="login-container">
  <div class="login-left">
    <div class="col left-side d-flex flex-column justify-content-between">
      <div class="image-container w-100 p-5">
        <img src="{ RubuPlusLogo }" alt="Logo" class="mb-5"><br>
        <div class="mt-4">
          <span class="text text-uppercase" style="font-size: 38px; font-weight: 300; font-family: 'Sofia-Pro-ExtraLight'; line-height: 52px">Dijital İçerik</span><br>
          <span class="text text-uppercase" style="font-size: 38px; font-weight: 900; font-family: 'Sofia-Pro-Bold'; line-height: 42px"> Medya Yönetim Platformu</span><br>
            
        </div>
      </div>
      <div class="image-container w-100">
        <img src="{ leftImage }" alt="Logo" class="img-fluid w-100">
      </div>
    </div>
  </div>
  <div class="login-middle d-flex justify-content-center align-items-middle bg-light" style="height: 100vh;">
    <div class="w-100 d-flex justify-content-end">
      <img src="{ plus }" alt="Logo" width="84" style="margin-left: -42px; z-index: 1;">
    </div>
  </div>
  <div class="login-right bg-light">
      <div style="width: 420px;">
          <div class="mb-2">
            <span style="font-weight: 800; font-size: 32px; color: #25324B">Üye Girişi </span>
            <span style="font-weight: 400; font-size: 32px; color: #25324B">Yapın</span>
          </div>
          <p style="font-weight: 400; color: #a3a3a3; font-size: 14px; font-family: 'Sofia-Pro-Light', sans-serif !important">Sisteme giriş için kullanıcı adınızı veya e-posta adresinizi giriniz.</p>
          <form>
              <div class="input-group mb-3" id="emailInputGroup">
                <span class="input-group-addon bg-white align-items-center d-flex" id="emailAddon">
                  <img src="{ userLogo }" alt="User Logo" width="24" />
                </span>
                <input type="email" class="form-control" style="font-size: 14px;" id="inputEmail" aria-describedby="emailHelp" placeholder="E-Posta Adresi Giriniz" bind:value={email} />
              </div>
              <div class="input-group mb-3" id="passwordInputGroup">
                <span class="input-group-addon bg-white align-items-center d-flex" id="passwordAddon">
                  <img src="{ smartLock }" alt="User Logo" width="24" />
                </span>
                <input type="password" class="form-control" id="inputPassword" bind:value={password} placeholder="Şifre Giriniz"/>
              </div>
              <button type="submit" class="btn btn-primary w-100 border-0" style="height: 60px; background-color: #04A3DA; font-weight: 600;" on:click={handleLogin}>Giriş Yap</button>
          </form>
      </div>
  </div>
</div>