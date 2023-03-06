<template>
    <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {

    };
  },
  computed: {

  },
  created() {
    this.$store.commit('SETUP_CONNECTION');
  },
  beforeUnmount() {
    this.$store.dispatch('disconnect');
  },
  methods: {

  }
};
</script>

<style>
html {
  font-family: sans-serif;
}
</style>
