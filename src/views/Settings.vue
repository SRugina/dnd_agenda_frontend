<template>
  <div class="settings-page">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" cols="12">
          <h1 class="text-center">Your Settings</h1>
          <b-form @submit.prevent="updateSettings()" autocomplete="off">
            <b-form-group :disabled="inProgress">
              <b-form-group>
                <b-form-group id="input-group-1" label-for="input-1">
                  <b-form-input
                    id="input-1"
                    v-model="currentUser.image"
                    type="url"
                    placeholder="URL of profile picture"
                  ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="currentUser.username"
                    type="text"
                    placeholder="Your username"
                    size="lg"
                  ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label-for="input-3">
                  <b-form-textarea
                    id="input-3"
                    rows="8"
                    v-model="currentUser.bio"
                    placeholder="Short bio about you"
                    size="lg"
                    maxlength="150"
                  ></b-form-textarea>
                </b-form-group>
                <b-form-group id="input-group-4" label-for="input-4">
                  <b-form-input
                    id="input-4"
                    v-model="currentUser.email"
                    type="text"
                    placeholder="Email"
                    size="lg"
                  ></b-form-input>
                </b-form-group>
                <b-button
                  type="submit"
                  variant="primary"
                  size="lg"
                  style="float: right;"
                  >Update Settings</b-button
                >
              </b-form-group>
            </b-form-group>
          </b-form>
          <!-- Line break for password button -->
          <hr />
          <b-button
            exact
            :to="{ name: 'settings-password' }"
            variant="outline-danger"
            >Or Change your Password</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { UPDATE_USER } from "@/store/actions.type";

export default {
  name: "RwvSettings",
  data() {
    return {
      inProgress: false
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    updateSettings() {
      this.inProgress = true;
      this.$store.dispatch(UPDATE_USER, this.currentUser).then(() => {
        this.inProgress = false;
        this.$bvToast.toast("Settings Updated", {
          title: "Success",
          autoHideDelay: 5000,
          variant: "success"
        });
      });
    }
  }
};
</script>
