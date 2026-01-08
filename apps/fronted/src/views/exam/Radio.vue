<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  length: number
}>()
const options = ref<Option[]>([
  { label: '选项A', value: 'A' },
  { label: '选项B', value: 'B' },
])

// 💡 补全缺失的响应式变量
const questionText = ref('')
const score = ref(5)
const correctAnswer = ref('')
const answerAnalyse = ref('')
const addOption = () => {
  const nextChar = String.fromCharCode(65 + options.value.length)
  options.value.push({ label: `选项${nextChar}`, value: nextChar })
}

const removeOption = (index: number) => {
  options.value.splice(index, 1)
}

// 💡 关键：暴露一个方法，让父组件能拿走这里的数据
const getQuestionData = () => {
  return {
    type: 'radio',
    question: questionText.value,
    options: options.value.map((o) => o.label),
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
  options.value = [
    { label: '选项A', value: 'A' },
    { label: '选项B', value: 'B' },
  ]
}

// 别忘了暴露出去
defineExpose({ getQuestionData, resetForm })
</script>

<template>
  <el-form label-width="80px">
    <el-form-item label="问题内容">
      <el-input type="textarea" v-model="questionText" placeholder="请输入问题内容" />
    </el-form-item>
    <el-form-item label="选项">
      <el-space direction="vertical" alignment="stretch" style="width: 100%">
        <el-radio-group v-model="correctAnswer" style="width: 100%">
          <el-space direction="vertical" alignment="stretch" style="width: 100%">
            <el-radio
              v-for="(item, index) in options"
              :key="index"
              :value="item.value"
              class="custom-radio"
            >
              <div class="option-wrapper">
                <el-input v-model="item.label" size="small" style="width: 80%" @click.stop />
                <el-tag type="warning" closable @close="removeOption(index)">取消</el-tag>
              </div>
            </el-radio>
          </el-space>
        </el-radio-group>
        <el-button type="primary" @click="addOption" plain size="small">+ 添加选项</el-button>
      </el-space>
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
.custom-radio {
  width: 100%;
  margin-right: 0;
  display: flex;
  align-items: center;

  // 💡 关键：让 Element 的内部 Label 容器占满剩余空间
  :deep(.el-radio__label) {
    flex: 1;
    padding-left: 10px;
  }
}

.option-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;

  :deep(.el-input) {
    flex: 1; // 让输入框占据左侧所有空间
  }
}
</style>
