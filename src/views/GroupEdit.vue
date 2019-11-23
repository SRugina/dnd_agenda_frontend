<template>
  <div class="editor-page">
    <b-container>
      <b-row>
        <b-col md="5" offset-md="1" cols="12">
          <RwvListErrors :errors="errors" />
          <b-form @submit.prevent="onPublish(group.slug)" autocomplete="off">
            <b-form-group :disabled="inProgress">
              <b-form-group id="input-group-1" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="group.name"
                  type="text"
                  required
                  placeholder="Group Name"
                  size="lg"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-2" label-for="input-2">
                <b-form-textarea
                  id="input-2"
                  rows="8"
                  no-resize
                  required
                  v-model="group.description"
                  placeholder="What's this group about? (write in markdown)"
                ></b-form-textarea>
              </b-form-group>
              <b-form-group
                v-if="!group.slug"
                id="input-group-3"
                label-for="input-3"
              >
                <cool-select
                  v-model="group.admin"
                  :items="profiles"
                  :loading="isLoadingProfiles"
                  itemText="username"
                  itemValue="id"
                  placeholder="The Admin"
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
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="outline-danger"
                style="float: left; margin-right: 1em;"
                @click="deleteGroup"
                v-if="!!group.slug"
                >Delete Group</b-button
              >
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="outline-warning"
                style="float: left;"
                :to="editGroupAdminLink"
                v-if="!!group.slug"
                >Change the Admin</b-button
              >
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="primary"
                size="lg"
                style="float: right;"
                v-if="!group.slug"
                >Publish Group</b-button
              >
              <b-button
                :disabled="inProgress"
                type="submit"
                variant="primary"
                style="float: right;"
                v-if="!!group.slug"
                >Save Changes</b-button
              >
            </b-form-group>
          </b-form>
        </b-col>
        <b-col md="5" offset-md="1" cols="12">
          <h2 class="text-center">Preview Group Description</h2>
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
  GROUP_PUBLISH,
  GROUP_EDIT,
  GROUP_DELETE,
  FETCH_GROUP,
  GROUP_RESET_STATE,
  FETCH_PROFILES
} from "@/store/actions.type";

import marked from "marked";
import { sanitize } from "dompurify";
import { CoolSelect } from "vue-cool-select";

export default {
  name: "RwvGroupEdit",
  components: { RwvListErrors, CoolSelect },
  props: {
    previousGroup: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /group-editor/:slug to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(GROUP_RESET_STATE);
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the group
    await store.dispatch(GROUP_RESET_STATE);
    if (to.params.slug !== undefined) {
      const data = await store.dispatch(
        FETCH_GROUP,
        to.params.slug,
        to.params.previousGroup
      );
      if (store.getters.currentUser.username != data.group.admin.username) {
        return next({
          name: "group",
          params: { slug: data.group.slug }
        });
      }
    }
    return next();
  },
  async beforeRouteLeave(to, from, next) {
    await store.dispatch(GROUP_RESET_STATE);
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
      noProfilesData: false
    };
  },
  computed: {
    ...mapGetters(["group", "isLoadingProfiles", "profiles"]),
    previewText() {
      return sanitize(marked(this.group.description));
    },
    profileListConfig() {
      const filters = {
        global_search: true,
        limit: 10
      };
      return {
        filters
      };
    },
    editGroupAdminLink() {
      return { name: "group-admin-edit", params: { slug: this.group.slug } };
    }
  },
  methods: {
    onPublish(slug) {
      let action = slug ? GROUP_EDIT : GROUP_PUBLISH;
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.push({
            name: "group",
            params: { slug: data.group.slug }
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
    async deleteGroup() {
      try {
        await this.$store.dispatch(GROUP_DELETE, this.group.id);
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
