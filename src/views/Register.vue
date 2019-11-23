<template>
  <div class="auth-page">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" cols="12">
          <h1 class="text-center">Sign up</h1>
          <p class="text-center">
            <b-link :to="{ name: 'login' }">Have an account?</b-link>
          </p>
          <div v-if="errors" class="error-messages">
            {{ showErrors }}
          </div>
          <b-form @submit.prevent="onSubmit">
            <b-form-group :disabled="inProgress">
              <b-form-group id="input-group-1" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="username"
                  type="text"
                  required
                  placeholder="Username"
                  size="lg"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-2" label-for="input-2">
                <b-form-input
                  id="input-2"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Email"
                  size="lg"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-3" label-for="input-3">
                <b-form-input
                  id="input-3"
                  v-model="password"
                  type="password"
                  required
                  placeholder="Password"
                  size="lg"
                ></b-form-input>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                style="float: right;"
                >Sign up</b-button
              >
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { REGISTER } from "@/store/actions.type";

export default {
  name: "RwvRegister",
  data() {
    return {
      inProgress: false,
      username: "",
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    }),
    showErrors() {
      for (let key in this.errors) {
        this.$bvToast.toast(`${this.errors[key][0]}`, {
          title: `${key}`,
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
      return null;
    }
  },
  methods: {
    onSubmit() {
      this.inProgress = true;
      this.$store
        .dispatch(REGISTER, {
          email: this.email,
          password: this.password,
          username: this.username
        })
        .then(() => {
          this.inProgress = false;
          this.$router.push({ name: "home" });
        })
        .catch(() => {
          this.inProgress = false;
        });
    }
  }
};
</script>
