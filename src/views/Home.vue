<template>
  <div class="home-page">
    <b-jumbotron
      bg-variant="transparent"
      fluid
      class="home-banner"
      text-variant="white"
    >
      <template v-slot:header>
        <h1 id="home-banner-h1" class="text-center" style="font-weight: 600;">
          D&amp;Dear Al {{ process.env.API_URL }}
        </h1>
      </template>

      <template v-slot:lead>
        <br />
        <p class="text-center" style="font-weight: 600;">
          A place to plan Dungeons and Dragons sessions.
        </p>
      </template>
    </b-jumbotron>
    <b-container v-if="isAuthenticated">
      <b-row>
        <b-col md="9">
          <b-card title="Feed Navigation" no-body>
            <b-card-header header-tag="nav">
              <b-nav card-header pills>
                <b-nav-item
                  :to="{ name: 'home' }"
                  exact
                  exact-active-class="active"
                  >Your Feed</b-nav-item
                >
                <b-nav-item
                  :to="{ path: '/search/session/' }"
                  active-class="active"
                  >Search Sessions</b-nav-item
                >
                <b-nav-item
                  :to="{ path: '/search/group/' }"
                  active-class="active"
                  >Search Groups</b-nav-item
                >
                <b-nav-item
                  :to="{ path: '/search/user/' }"
                  active-class="active"
                  >Search Users</b-nav-item
                >
              </b-nav>
            </b-card-header>

            <b-card-body>
              <router-view></router-view>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col md="3">
          <b-jumbotron
            bg-variant="info"
            text-variant="white"
            lead="More features coming soon..."
          ></b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else></b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "home",
  computed: {
    ...mapGetters(["isAuthenticated"])
  }
};
</script>
