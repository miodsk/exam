<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Api } from '@/api/examApi'
import { useRouter, useRoute } from 'vue-router'
import { type Question } from '@/types'
const api = new Api().exam
const router = useRouter()
const route = useRoute()
const questions = ref<Question[]>([])
const examId = ref<number>(Number(route.params.id))
import { Api as AnswerApi } from '@/api/answerApi'
import type { AxiosResponse } from 'axios'

interface uploadRes {
  score: number
  [propName: string]: any
}
const answerApi = new AnswerApi().answer
const getExamInfo = async () => {
  const res = await api.examControllerDetail(String(examId.value))
  console.log(res)
  questions.value = JSON.parse(res.content)
}

const submitAnswers = async () => {
  console.log(userAnswers.value)
  const res = await answerApi.answerControllerAdd({
    content: JSON.stringify(userAnswers.value),
    examId: examId.value,
  })
  console.log(res)
  router.push({ name: 'result', query: { id: res.id } })
}
const userAnswers = ref<Record<number, any>>({})
onMounted(() => {
  getExamInfo()
})
</script>

<template>
  <div id="examContainer">
    <div v-for="question in questions" :key="question.id" class="question-item">
      <div class="question-header">
        <span class="question-number">第 {{ question.id }} 题</span>
        <span class="question-score">({{ question.score }} 分)</span>
      </div>

      <div class="question-content">
        <p>{{ question.question }}</p>
      </div>

      <div class="question-answer">
        <!-- 单选题 -->
        <div v-if="question.type === 'radio'">
          <el-radio-group v-model="userAnswers[question.id]">
            <el-radio
              v-for="(opt, index) in question.options"
              :key="index"
              :value="String.fromCharCode(65 + index)"
            >
              {{ String.fromCharCode(65 + index) }}.
              {{ opt }}
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 多选题 -->
        <div v-else-if="question.type === 'checkbox'">
          <el-checkbox-group v-model="userAnswers[question.id]">
            <el-checkbox
              v-for="(opt, index) in question.options"
              :key="index"
              :value="String.fromCharCode(65 + index)"
            >
              {{ String.fromCharCode(65 + index) }}.
              {{ opt }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <!-- 填空题 -->
        <div v-else-if="question.type === 'input'">
          <el-input
            v-model="userAnswers[question.id]"
            placeholder="请输入答案"
            type="textarea"
            :rows="3"
          />
        </div>
      </div>
    </div>
    <el-button type="primary" style="display: block; margin: 20px auto 0" @click="submitAnswers"
      >提交</el-button
    >
  </div>
</template>

<style scoped lang="scss">
#examContainer {
  width: 70%;
  margin: 10px auto 0;
  min-height: 100vh;
  background-color: lightblue;
  padding: 20px;
}
.exam-info {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;

  h2 {
    margin: 0 0 10px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .total-score {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-item {
  background-color: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
  box-shadow: var(--shadow-sm);

  .question-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;

    .question-number {
      font-weight: 600;
      color: var(--text-primary);
    }

    .question-score {
      font-size: 14px;
      color: var(--text-secondary);
    }
  }

  .question-content {
    margin-bottom: 15px;

    p {
      margin: 0;
      color: var(--text-primary);
    }
  }

  .question-answer {
    :deep(.el-radio),
    :deep(.el-checkbox) {
      margin-bottom: 10px;
    }
  }
}
</style>
