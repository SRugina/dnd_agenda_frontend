<template>
  <div class="settings-password-page">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" cols="12">
          <h1 class="text-center">Change Password</h1>
          <RwvListErrors :errors="errors" />
          <b-form @submit.prevent="updateSettings()">
            <b-form-group>
              <b-form-group id="input-group-1" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="oldPassword"
                  type="password"
                  placeholder="Your Old Password"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-2" label-for="input-2">
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  placeholder="Your New Password"
                  size="lg"
                ></b-form-input>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                style="float: right;"
                >Update Password</b-button
              >
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import RwvListErrors from "@/components/ListErrors";
import { UPDATE_USER_PASSWORD } from "@/store/actions.type";

export default {
  name: "RwvSettingsPassword",
  components: { RwvListErrors },
  data() {
    return {
      inProgress: false,
      oldPassword: "",
      password: "",
      errors: {}
    };
  },
  methods: {
    updateSettings() {
      this.inProgress = true;
      let oldPassword = this.oldPassword;
      let password = this.password;
      this.$store
        .dispatch(UPDATE_USER_PASSWORD, { oldPassword, password })
        .then(() => {
          this.inProgress = false;
          // #todo, nice toast and no redirect
          this.$router.push({ name: "home" });
        })
        .catch(({ response }) => {
          this.inProgress = false;
          this.errors = response.data.errors;
        });
    }
  }
};
</script>
