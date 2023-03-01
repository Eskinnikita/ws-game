<template>
  <router-view/>
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
  created() {
    this.$store.commit('SETUP_CONNECTION')
  },
  beforeUnmount() {
    this.$store.dispatch('disconnect')
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style>
</style>
