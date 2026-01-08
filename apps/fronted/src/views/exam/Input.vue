<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  length: number
}>()

// 响应式变量
const questionText = ref('')
const score = ref(5)
const correctAnswer = ref('')
const answerAnalyse = ref('')

// 暴露方法，让父组件能拿走这里的数据
const getQuestionData = () => {
  return {
    type: 'input',
    question: questionText.value,
    answer: correctAnswer.value,
    score: score.value, // 默认分值
    answerAnalyse: answerAnalyse.value,
  }
}
const resetForm = () => {
  questionText.value = ''
  correctAnswer.value = ''
  answerAnalyse.value = ''
  score.value = 5
}

// 暴露出去
defineExpose({ getQuestionData, resetForm })
</script>

<template>
  <el-form label-width="80px">
    <el-form-item label="问题内容">
      <el-input type="textarea" v-model="questionText" placeholder="请输入问题内容" />
    </el-form-item>
    <el-form-item label="正确答案">
      <el-input v-model="correctAnswer" placeholder="请输入正确答案" />
    </el-form-item>
    <el-form-item label="分值">
      <el-input-number v-model="score" :min="1" :max="10" />
    </el-form-item>
    <el-form-item label="答案解析">
      <el-input type="textarea" v-model="answerAnalyse" placeholder="请输入答案解析（可选）" />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
/* 填空组件样式相对简单，主要继承Element Plus默认样式 */
</style>