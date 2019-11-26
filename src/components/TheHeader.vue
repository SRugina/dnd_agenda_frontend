<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="secondary"
    style="border-bottom: 4px solid #9d0a0e;"
  >
    <b-navbar-brand :to="{ name: 'home' }">
      <img src="https://dndearall.com/img/d20-icon.png" style="height: 2rem;" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item exact exact-active-class="active" :to="{ name: 'home' }"
          >Home</b-nav-item
        >
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form v-if="isAuthenticated" @submit.prevent="search()">
          <b-form-input
            size="sm"
            class="mr-sm-2"
            v-model="search_slug"
            :placeholder="'search for ' + search_for"
          ></b-form-input>
        </b-nav-form>

        <b-nav-item-dropdown text="Filter By" v-if="isAuthenticated" right>
          <b-dropdown-item-button v-on:click="search_for = 'group'"
            >Group</b-dropdown-item-button
          >
          <b-dropdown-item-button v-on:click="search_for = 'session'"
            >Session</b-dropdown-item-button
          >
          <b-dropdown-item-button v-on:click="search_for = 'user'"
            >User</b-dropdown-item-button
          >
        </b-nav-item-dropdown>

        <b-navbar-nav v-if="!isAuthenticated">
          <b-nav-item exact exact-active-class="active" :to="{ name: 'login' }"
            >Sign in</b-nav-item
          >
          <b-nav-item
            exact
            exact-active-class="active"
            :to="{ name: 'register' }"
            >Sign up</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <font-awesome-icon :icon="['fas', 'plus']" />
            </template>
            <b-dropdown-item
              active-class="active"
              :to="{ name: 'session-edit' }"
              >&nbsp;New Session</b-dropdown-item
            >
            <b-dropdown-item active-class="active" :to="{ name: 'group-edit' }"
              >&nbsp;New Group</b-dropdown-item
            >
          </b-nav-item-dropdown>

          <b-nav-item
            exact
            exact-active-class="active"
            :to="{ name: 'notifications' }"
          >
            <font-awesome-icon :icon="['fas', 'bell']" />
          </b-nav-item>

          <b-nav-item-dropdown v-if="currentUser.username" right>
            <template v-slot:button-content>
              <img :src="currentUser.image" class="user-img" />
            </template>
            <b-dropdown-item
              exact
              exact-active-class="active"
              :to="{
                name: 'profile',
                params: { username: currentUser.username }
              }"
              >{{ currentUser.username }}</b-dropdown-item
            >
            <b-dropdown-item
              exact
              exact-active-class="active"
              :to="{ name: 'settings' }"
              >&nbsp;Settings</b-dropdown-item
            >
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button @click="logout" variant="danger"
              >Sign out</b-dropdown-item-button
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/store/actions.type";

export default {
  name: "RwvHeader",
  data() {
    return {
      search_for: "group",
      search_slug: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push("/");
      });
    },
    search() {
      this.$router.push({
        path: "/search/" + this.search_for + "/" + this.search_slug
      });
    }
  }
};
</script>
