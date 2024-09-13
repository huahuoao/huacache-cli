<template>
  <div id="app">
    <ApiTester />
  </div>
</template>

<script>
import ApiTester from './components/ApiTester.vue';

export default {
  name: 'App',
  components: {
    ApiTester
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
