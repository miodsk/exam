<script setup lang="ts">
import { type Question } from '@/types'

// 接收父组件传来的题目数据
const props = defineProps<{
  question: Question
}>()
</script>

<template>
  <el-card class="question-card">
    <template #header>
      <div class="card-header">
        <el-tag>第{{ question.id }}题</el-tag>
        <el-tag size="small">{{ question.type }}</el-tag>
        <slot name="drag"></slot>
        <span class="score">{{ question.score }} 分</span>
      </div>
    </template>
    <div>{{ question.question }}</div>
    <div style="margin-top: 5%">答案</div>
    <div v-if="question.type === 'radio'">
      <el-radio-group v-model="question.answer">
        <el-radio
          v-for="(opt, index) in question.options"
          :value="String.fromCharCode(65 + index)"
          :key="opt"
          disabled
        >
          {{ String.fromCharCode(65 + index) }}.{{ opt }}
        </el-radio>
      </el-radio-group>
    </div>

    <div v-else-if="question.type === 'checkbox'">
      <el-checkbox-group v-model="question.answer">
        <el-checkbox
          v-for="(opt, index) in question.options"
          :value="String.fromCharCode(65 + index)"
          disabled
          :key="opt"
        >
          {{ String.fromCharCode(65 + index) }}{{ opt }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div v-else-if="question.type === 'input'">
      <el-input v-model="question.answer" disabled placeholder="请输入答案" />
    </div>
    <div class="analyse"><strong>解析：</strong>{{ question.answerAnalyse }}</div>
  </el-card>
</template>

<style scoped lang="scss">
:deep(.el-card) {
  margin-bottom: 0;
}

.question-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .question-title {
      font-weight: bold;
    }

    .score {
      color: #f56c6c;
    }
  }

  .analyse {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #eee;
    font-size: 14px;
    color: #666;
  }
}
</style>
