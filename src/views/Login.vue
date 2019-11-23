<template>
  <div class="auth-page">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" cols="12">
          <h1 class="text-center">Sign in</h1>
          <p class="text-center">
            <b-link :to="{ name: 'register' }">Need an account?</b-link>
          </p>
          <div v-if="errors" class="error-messages">
            {{ showErrors }}
          </div>
          <b-form @submit.prevent="onSubmit(email, password)">
            <b-form-group id="input-group-1" label-for="input-1">
              <b-form-input
                id="input-1"
                v-model="email"
                type="email"
                required
                placeholder="Email"
                size="lg"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label-for="input-2">
              <b-form-input
                id="input-2"
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
              >Sign in</b-button
            >
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { LOGIN } from "@/store/actions.type";

export default {
  name: "RwvLogin",
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch(LOGIN, { email, password })
        .then(() => this.$router.push({ name: "home" }));
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    }),
    showErrors() {
      this.$bvToast.toast(`${this.errors}`, {
        title: "Error",
        autoHideDelay: 5000,
        variant: "danger"
      });
      return null;
    }
  }
};
</script>
