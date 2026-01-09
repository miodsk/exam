<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Api as AnswerApi } from '@/api/answerApi'
import { Api as AnalyseApi } from '@/api/analyseApi'
import type { Answer } from '@/api/answerApi'

const answerApi = new AnswerApi().answer
const analyseApi = new AnalyseApi().analyse

const examRecords = ref([])
const rankings = ref<Map<number, string[]>>(new Map())

const getExamRecords = async () => {
  try {
    const res = await answerApi.answerControllerFindByUserId()
    examRecords.value = res
    // 自动获取每条记录的排名
    console.log('获取考试记录...', examRecords.value)
  } catch (error) {
    console.error('获取考试记录失败:', error)
  }
}

const getRanking = async (examId: number) => {
  try {
    const res = await analyseApi.analyseControllerRanking({ examId })
    console.log(res[0])
    examRecords.value.find((item) => item.examId === examId).rank = res[0]
  } catch (error) {
    console.error('获取排名失败:', error)
  }
}

onMounted(() => {
  getExamRecords()
})
</script>

<template>
  <div id="examRecordContainer">
    <h2>我的考试记录</h2>
    <el-table :data="examRecords" style="width: 100%" border>
      <el-table-column prop="exam.name" label="考试名称" min-width="200" />
      <el-table-column prop="score" label="我的分数" width="100" align="center" />
      <el-table-column label="排名" width="100" align="center" prop="rank"> </el-table-column>
      <el-table-column prop="createTime" label="考试时间" width="200" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="getRanking(scope.row.examId)">
            刷新排名
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="examRecords.length === 0" description="暂无考试记录" />
  </div>
</template>

<style scoped lang="scss">
#examRecordContainer {
  width: 70%;
  margin: 20px auto 0;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
