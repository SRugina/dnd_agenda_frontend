<template>
  <footer>
    <b-container>
      <b-row>
        <b-link class="logo-font" :to="{ name: 'home', params: {} }"
          >DnD Agenda</b-link
        >
        <span>
          Made by
          <a
            rel="noopener noreferrer"
            target="blank"
            href="https://github.com/SRugina"
            >SRugina</a
          >.
        </span>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
export default {
  name: "RwvFooter"
};
</script>
