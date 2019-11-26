<template>
  <div class="editor-page">
    <b-container>
      <b-row>
        <b-col md="5" offset-md="1" cols="12">
          <RwvListErrors :errors="errors" />
          <b-form @submit.prevent="onPublish(session.slug)" autocomplete="off">
            <b-form-group :disabled="inProgress">
              <b-form-group id="input-group-1" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="session.title"
                  type="text"
                  required
                  placeholder="Session Title"
                  size="lg"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-2" label-for="input-2">
                <b-form-textarea
                  id="input-2"
                  rows="8"
                  no-resize
                  required
                  v-model="session.description"
                  placeholder="What's this session about? (write in markdown)"
                ></b-form-textarea>
              </b-form-group>
              <b-form-group
                v-if="!session.slug"
                id="input-group-3"
                label-for="input-3"
              >
                <cool-select
                  v-model="session.dm"
                  :items="profiles"
                  :loading="isLoadingProfiles"
                  itemText="username"
                  itemValue="id"
                  placeholder="The DM (Dungeon Master)"
                  disableFilteringBySearch
                  inputForTextClass="form-control"
                  :inputElCustomAttributes="{
                    id: 'input-3',
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
                      <img :src="search_img(item.image)" class="user-img" />

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
              <b-form-group id="input-group-4" label-for="input-4">
                <v-date-picker
                  v-model="session.date"
                  :input-props="{
                    id: 'input-4',
                    class: 'form-control',
                    placeholder: 'The date of the Session',
                    required: true,
                    'aria-required': true
                  }"
                />
              </b-form-group>
              <b-form-group id="input-group-5" label-for="input-5">
                <datetime
                  input-id="input-5"
                  input-class="form-control"
                  type="time"
                  v-model="session.time"
                  placeholder="Time (UTC±00:00)"
                  required="required"
                  aria-required="true"
                ></datetime>
              </b-form-group>
              <b-form-group id="input-group-6" label-for="input-6">
                <b-input-group>
                  <b-input-group-prepend>
                    <b-button
                      :style="'background-color:' + session.colour + ';'"
                    ></b-button>
                  </b-input-group-prepend>
                  <b-form-select
                    id="input-6"
                    v-model="session.colour"
                    required
                    :options="colours"
                  ></b-form-select>
                </b-input-group>
              </b-form-group>
              <b-form-group
                v-if="!session.slug"
                id="input-group-7"
                label-for="input-7"
              >
                <cool-select
                  v-model="session.group"
                  :items="groups"
                  :loading="isLoadingGroups"
                  itemText="name"
                  itemValue="id"
                  placeholder="The group this session belongs to"
                  disableFilteringBySearch
                  inputForTextClass="form-control"
                  :inputElCustomAttributes="{
                    id: 'input-7',
                    required: true,
                    'aria-required': true
                  }"
                  @search="onGroupsSearch"
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
              </b-form-group>
              <hr />
              <b-button
                :disabled="inProgress"
                variant="outline-danger"
                style="float: left; margin-right: 1em;"
                @click="deleteSession"
                v-if="!!session.slug"
                >Delete Session</b-button
              >
              <b-button
                :disabled="inProgress"
                variant="outline-warning"
                style="float: left;"
                :to="editSessionDMLink"
                v-if="!!session.slug"
                >Change the DM</b-button
              >
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="primary"
                style="float: right;"
                size="lg"
                v-if="!session.slug"
                >Publish Session</b-button
              >
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="primary"
                style="float: right;"
                v-if="!!session.slug"
                >Save Changes</b-button
              >
            </b-form-group>
          </b-form>
        </b-col>
        <b-col md="5" offset-md="1" cols="12">
          <h2 class="text-center">Preview Session Description</h2>
          <div class="preview pre-scrollable" v-html="previewText"></div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import RwvListErrors from "@/components/ListErrors";
import {
  SESSION_PUBLISH,
  SESSION_EDIT,
  SESSION_DELETE,
  FETCH_SESSION,
  SESSION_RESET_STATE,
  FETCH_PROFILES,
  FETCH_GROUPS
} from "@/store/actions.type";

import marked from "marked";
import { sanitize } from "dompurify";
import { CoolSelect } from "vue-cool-select";

export default {
  name: "RwvSessionEdit",
  components: { RwvListErrors, CoolSelect },
  props: {
    previousSession: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /session-editor/:slug to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(SESSION_RESET_STATE);
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the session
    await store.dispatch(SESSION_RESET_STATE);
    if (to.params.slug !== undefined) {
      const data = await store.dispatch(
        FETCH_SESSION,
        to.params.slug,
        to.params.previousSession
      );

      if (store.getters.currentUser.username != data.session.dm.username) {
        return next({
          name: "session",
          params: { slug: data.session.slug }
        });
      }
    }
    return next();
  },
  async beforeRouteLeave(to, from, next) {
    await store.dispatch(SESSION_RESET_STATE);
    next();
  },
  data() {
    return {
      inProgress: false,
      colours: [
        { value: null, text: "Please select a colour" },
        "red",
        "blue",
        "green",
        "purple",
        "yellow",
        "violet"
      ],
      errors: {},
      noProfilesData: false,
      noGroupsData: false
    };
  },
  computed: {
    ...mapGetters([
      "session",
      "isLoadingProfiles",
      "profiles",
      "isLoadingGroups",
      "groups"
    ]),
    previewText() {
      return sanitize(marked(this.session.description));
    },
    profileListConfig() {
      const filters = {
        limit: 10
      };
      return {
        filters
      };
    },
    groupListConfig() {
      const filters = {
        limit: 10
      };
      return {
        filters
      };
    },
    editSessionDMLink() {
      return { name: "session-dm-edit", params: { slug: this.session.slug } };
    }
  },
  methods: {
    onPublish(slug) {
      let action = slug ? SESSION_EDIT : SESSION_PUBLISH;
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.push({
            name: "session",
            params: { slug: data.session.slug }
          });
        })
        .catch(({ response }) => {
          this.inProgress = false;
          this.errors = response.data.errors;
        });
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
    search_img(item_image) {
      if (item_image) {
        return item_image;
      } else {
        return "https://dndearall.com/img/smiley.jpg";
      }
    },
    async deleteSession() {
      try {
        await this.$store.dispatch(SESSION_DELETE, this.session.id);
        this.$router.push("/");
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.loading-indicator {
  width: 20px;
  margin-right: 10px;
}
</style>
