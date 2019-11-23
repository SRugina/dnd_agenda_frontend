<template>
  <div class="invite-page">
    <b-container>
      <br />
      <b-row>
        <b-col md="6" offset-md="3">
          <b-form @submit.prevent="invite" autocomplete="off">
            <b-form-group :disabled="inProgress">
              <b-form-group id="input-group-1" label-for="input-1">
                <cool-select
                  v-if="!$route.query.userId"
                  v-model="userId"
                  :items="profiles"
                  :loading="isLoadingProfiles"
                  itemText="username"
                  itemValue="id"
                  placeholder="User"
                  disableFilteringBySearch
                  inputForTextClass="form-control"
                  :inputElCustomAttributes="{
                    id: 'input-1',
                    required: true,
                    'aria-required': true
                  }"
                  @search="onProfilesSearch"
                >
                  <template #no-data>
                    {{
                      noProfilesData
                        ? "No information found by request."
                        : "We need at least 2 letters to search."
                    }}
                  </template>
                  <template #item="{ item }">
                    <div class="item">
                      <img :src="item.image" class="user-img" />

                      <div>
                        <span class="item-username">{{ item.username }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-if="isLoadingProfiles" #input-end>
                    <!-- loading spinner -->
                    <img
                      src="https://i.imgur.com/mTNe6tr.gif"
                      class="loading-indicator"
                    />
                  </template>
                </cool-select>
              </b-form-group>
              <b-form-group>
                <b-form-radio-group
                  v-if="!$route.query.userId && !$route.query.parentType"
                  id="btn-radios-2"
                  v-model="parentType"
                  :options="parentTypeOptions"
                  buttons
                  button-variant="outline-secondary"
                  size="sm"
                  name="radio-btn-outline"
                  required
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group
                id="input-group-2"
                label-for="input-2"
                v-if="!$route.query.parentName"
              >
                <cool-select
                  v-model="parentId"
                  :items="groups"
                  :loading="isLoadingGroups"
                  itemText="name"
                  itemValue="id"
                  placeholder="The Group"
                  disableFilteringBySearch
                  inputForTextClass="form-control"
                  :inputElCustomAttributes="{
                    id: 'input-2',
                    required: true,
                    'aria-required': true
                  }"
                  @search="onGroupsSearch"
                  v-if="parentType === 'group'"
                >
                  <template #no-data>
                    {{
                      noGroupsData
                        ? "No information found by request."
                        : "We need at least 2 letters to search."
                    }}
                  </template>
                  <template #item="{ item }">
                    <div class="item">
                      <!-- <img :src="item.image" class="user-img" /> -->

                      <div>
                        <span class="item-name">{{ item.name }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-if="isLoadingGroups" #input-end>
                    <!-- loading spinner -->
                    <img
                      src="https://i.imgur.com/mTNe6tr.gif"
                      class="loading-indicator"
                    />
                  </template>
                </cool-select>
                <cool-select
                  v-model="parentId"
                  :items="sessions"
                  :loading="isLoadingSessions"
                  itemText="title"
                  itemValue="id"
                  placeholder="The Session"
                  disableFilteringBySearch
                  inputForTextClass="form-control"
                  :inputElCustomAttributes="{
                    id: 'input-2',
                    required: true,
                    'aria-required': true
                  }"
                  @search="onSessionsSearch"
                  v-if="parentType === 'session'"
                >
                  <template #no-data>
                    {{
                      noSessionsData
                        ? "No information found by request."
                        : "We need at least 2 letters to search."
                    }}
                  </template>
                  <template #item="{ item }">
                    <div class="item">
                      <!-- <img :src="item.image" class="user-img" /> -->

                      <div>
                        <span class="item-title">{{ item.title }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-if="isLoadingSessions" #input-end>
                    <!-- loading spinner -->
                    <img
                      src="https://i.imgur.com/mTNe6tr.gif"
                      class="loading-indicator"
                    />
                  </template>
                </cool-select>
              </b-form-group>
              <div v-else>
                To
                <h3>{{ parentName }}</h3>
              </div>
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="primary"
                size="lg"
                style="float: right;"
                >Invite User</b-button
              >
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  FETCH_PROFILES,
  FETCH_GROUPS,
  FETCH_SESSIONS,
  INVITE_TO_GROUP,
  INVITE_TO_SESSION
} from "@/store/actions.type";

import { CoolSelect } from "vue-cool-select";

export default {
  name: "RwvInvite",
  components: { CoolSelect },
  data() {
    return {
      inProgress: false,
      noProfilesData: false,
      noGroupsData: false,
      noSessionsData: false,
      parentType: this.$route.query.parentType,
      userId: this.$route.query.userId,
      parentId: this.$route.query.parentId,
      parentTypeOptions: [{ text: "group" }, { text: "session" }],
      parentName: this.$route.query.parentName,
      username: this.$route.query.username
    };
  },
  computed: {
    ...mapGetters([
      "isLoadingProfiles",
      "profiles",
      "groups",
      "isLoadingGroups",
      "sessions",
      "isLoadingSessions"
    ]),
    profileListConfig() {
      const filters = {
        global_search: this.parentType === "group" ? true : false,
        limit: 10
      };
      return {
        filters
      };
    },
    groupListConfig() {
      const filters = {
        global_search: true,
        limit: 10
      };
      return {
        filters
      };
    },
    sessionListConfig() {
      const filters = {
        limit: 10
      };
      return {
        filters
      };
    }
  },
  methods: {
    invite() {
      let action =
        this.parentType === "group" ? INVITE_TO_GROUP : INVITE_TO_SESSION;
      this.inProgress = true;
      this.$store
        .dispatch(action, { parent_id: this.parentId, user_id: this.userId })
        .then(() => {
          this.$router.push("/");
        })
        .catch(({ response }) => {
          this.$bvToast.toast(`${response.data.error}`, {
            title: "Error",
            autoHideDelay: 5000,
            variant: "danger"
          });
        });
      this.inProgress = false;
    },
    onProfilesSearch(search) {
      const lettersLimit = 2;

      this.noProfilesData = false;
      if (search.length < lettersLimit) {
        this.$store.state.searchProfiles.profiles = [];
        this.$store.state.searchProfiles.isLoadingProfiles = false;
        return;
      }

      this.profileListConfig.filters.username = search;
      this.$store.dispatch(FETCH_PROFILES, this.profileListConfig);

      if (!this.profiles.length) this.noProfilesData = true;
    },
    onGroupsSearch(search) {
      const lettersLimit = 2;

      this.noGroupsData = false;
      if (search.length < lettersLimit) {
        this.$store.state.searchGroups.groups = [];
        this.$store.state.searchGroups.isLoadingGroups = false;
        return;
      }

      this.groupListConfig.filters.name = search;
      this.$store.dispatch(FETCH_GROUPS, this.groupListConfig);

      if (!this.groups.length) this.noGroupsData = true;
    },
    onSessionsSearch(search) {
      const lettersLimit = 2;

      this.noSessionsData = false;
      if (search.length < lettersLimit) {
        this.$store.state.home.sessions = [];
        this.$store.state.home.isLoadingSessions = false;
        return;
      }

      this.sessionListConfig.filters.title = search;
      this.$store.dispatch(FETCH_SESSIONS, this.sessionListConfig);

      if (!this.sessions.length) this.noSessionsData = true;
    }
  }
};
</script>
