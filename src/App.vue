<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html, body{
  width: 100vw;
  height: 100%;
}
#app {
  width: 100vw;
  height: 100%;
  /* overflow: hidden; */
}
</style>
