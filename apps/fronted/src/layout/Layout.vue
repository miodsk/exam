<script setup lang="ts">
import Nav from '@/layout/Nav.vue'
import Main from '@/layout/Main.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header height="auto" style="padding: 0">
        <Nav></Nav>
      </el-header>
      <el-container>
        <!--        <el-aside width="auto">Aside</el-aside>-->
        <el-main style="padding: 0">
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped></style>
