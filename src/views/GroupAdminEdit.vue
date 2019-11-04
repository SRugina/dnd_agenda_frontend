<template>
  <div class="editor-page">
    <b-container>
      <b-row>
        <b-col md="5" offset-md="1" cols="12">
          <RwvListErrors :errors="errors" />
          <b-form @submit.prevent="onPublish()">
            <b-form-group :disabled="inProgress">
              <b-form-group id="input-group-1" label-for="input-1">
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
            </b-form-group>
            <b-button
              :disabled="inProgress"
              type="submit"
              variant="primary"
              style="float: right;"
              >Update Admin</b-button
            >
          </b-form>
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
  GROUP_EDIT,
  FETCH_GROUP,
  GROUP_RESET_STATE,
  FETCH_PROFILES
} from "@/store/actions.type";

import marked from "marked";
import { sanitize } from "dompurify";
import { CoolSelect } from "vue-cool-select";

export default {
  name: "RwvGroupAdminEdit",
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
    }
  },
  methods: {
    onPublish() {
      this.inProgress = true;
      this.$store
        .dispatch(GROUP_EDIT)
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
        this.$store.state.search_profiles.profiles = [];
        this.$store.state.search_profiles.isLoadingProfiles = false;
        return;
      }

      this.profileListConfig.filters.username = search;
      this.$store.dispatch(FETCH_PROFILES, this.profileListConfig);

      if (!this.profiles.length) this.noProfilesData = true;
    },
    search_img(item_image) {
      if (item_image) {
        return item_image;
      } else {
        return "https://i.ibb.co/F7gn5W9/smiley.jpg";
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
