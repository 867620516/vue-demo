<template>
  <div id="app">
    <transition appear appear-active-class="animated bounce"
                        enter-active-class="animated bounce"
                      mode="out-in"
                      name="custom-classes-transition">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app'

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
