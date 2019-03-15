<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="/index/talent">人才管理</el-menu-item>
        <el-menu-item index="/index/position">岗位管理</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      activeIndex: '/index/talent'
    }
  }
}
</script>

<style scoped>

</style>
