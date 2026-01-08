<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Question } from '@/types'

const questions = defineModel<Question[]>('questions')
const visible = defineModel<boolean>('visible')
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', answers: Record<number, any>): void
}>()

// 用户答案
const userAnswers = ref<Record<number, any>>({})

// 提交答案
const submitAnswers = () => {
  emit('submit', userAnswers.value)
  emit('close')
}

// 关闭预览
const closePreview = () => {
  emit('close')
}
</script>

<template>
  <el-dialog v-model="visible" title="考试预览" width="800px" @close="closePreview">
    <div class="preview-container">
      <div class="exam-info">
        <h2>考试预览</h2>
      </div>

      <div class="questions-list">
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
                <el-radio v-for="(opt, index) in question.options" :key="index" :label="opt">
                  {{ opt }}
                </el-radio>
              </el-radio-group>
            </div>

            <!-- 多选题 -->
            <div v-else-if="question.type === 'checkbox'">
              <el-checkbox-group v-model="userAnswers[question.id]">
                <el-checkbox v-for="(opt, index) in question.options" :key="index" :label="opt">
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
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closePreview">关闭</el-button>
        <el-button type="primary" @click="submitAnswers">提交答案</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.preview-container {
  padding: 20px 0;

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
}
</style>
