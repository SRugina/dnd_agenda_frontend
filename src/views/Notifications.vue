<template>
  <b-container class="notification-page">
    <b-row>
      <b-col md="6">
        <b-card title="Received Session Invites:">
          <b-card-body>
            <RwvSessionInviteList :items-per-page="5"></RwvSessionInviteList>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card title="Received Session Requests:">
          <b-card-body>
            <RwvSessionRequestList :items-per-page="5"></RwvSessionRequestList>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <br />
    <b-row>
      <b-col md="6">
        <b-card title="Received Group Invites:">
          <b-card-body>
            <RwvGroupInviteList :items-per-page="5"></RwvGroupInviteList>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card title="Received Group Requests:">
          <b-card-body>
            <RwvGroupRequestList :items-per-page="5"></RwvGroupRequestList>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RwvSessionInviteList from "@/components/SessionInviteList";
import RwvSessionRequestList from "@/components/SessionRequestList";
import RwvGroupInviteList from "@/components/GroupInviteList";
import RwvGroupRequestList from "@/components/GroupRequestList";

export default {
  name: "RwvNotifications",
  components: {
    RwvSessionInviteList,
    RwvSessionRequestList,
    RwvGroupInviteList,
    RwvGroupRequestList
  }
};
</script>
