<template>
  <div class="profile-page">
    <div class="profile-info">
      <b-container>
        <b-row>
          <b-col md="10" offset-md="1" cols="12">
            <img :src="profile.image" class="profile-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <div v-if="isCurrentUser()">
              <b-button variant="outline-secondary" :to="{ name: 'settings' }"
                >Edit Profile Settings</b-button
              >
            </div>
            <div v-else>
              <b-button
                variant="outline-success"
                :to="{ name: 'invite', query: { userId: profile.id } }"
                >Invite</b-button
              >
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <br />
    <b-container>
      <b-row>
        <b-col md="10" offset-md="1" cols="12">
          <b-card title="Feed Navigation" no-body>
            <b-card-header header-tag="nav">
              <b-nav card-header pills>
                <b-nav-item
                  :to="{ name: 'profile' }"
                  exact
                  exact-active-class="active"
                  >All My Sessions</b-nav-item
                >
              </b-nav>
            </b-card-header>

            <b-card-body>
              <router-view></router-view>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { FETCH_PROFILE } from "@/store/actions.type";

export default {
  name: "RwvProfile",
  mounted() {
    this.$store.dispatch(FETCH_PROFILE, this.$route.params);
  },
  computed: {
    ...mapGetters(["currentUser", "profile", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.profile.username) {
        return this.currentUser.username === this.profile.username;
      }
      return false;
    }
  },
  watch: {
    $route(to) {
      this.$store.dispatch(FETCH_PROFILE, to.params);
    }
  }
};
</script>
