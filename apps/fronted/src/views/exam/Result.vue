<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Api } from '@/api/answerApi'
import { Api as AnalysisApi } from '@/api/analyseApi'

import { useRoute, useRouter } from 'vue-router'

const analysisApi = new AnalysisApi().analyse
const route = useRoute()
const api = new Api().answer
const score = ref<number>(0)
const activeNames = ref<string[]>([])
const getAnswer = async () => {
  if (!route.query.id) return
  
  try {
    const res = await api.answerControllerFind(String(route.query.id))
    score.value = res.score
    
    // 获取考试信息和正确答案
    const examContent = JSON.parse(res.exam.content)
    const userAnswers = JSON.parse(res.content)
    
    // 处理答案格式，用于显示
    answer.value = examContent.map((question: any) => ({
      question: question.question,
      type: question.type,
      userAnswer: userAnswers[question.id],
      correctAnswer: question.answer // 假设正确答案存储在question.answer中
    }))
    
    // 获取排名
    await getRank(Number(res.examId))
  } catch (error) {
    console.error('获取答案失败:', error)
  }
}

const answer = ref<any[]>([])

const getRank = async (examId: number) => {
  try {
    const res = await analysisApi.analyseControllerRanking({ examId })
    // 假设返回的是按分数排序的答案ID数组
    const answerId = String(route.query.id)
    rank.value = res.indexOf(answerId) + 1
  } catch (error) {
    console.error('获取排名失败:', error)
  }
}

const rank = ref<number>(0)

onMounted(() => {
  getAnswer()
})
</script>

<template>
  <div id="resultContainer">
    <h2>感谢完成答题</h2>
    <div class="result-summary">
      <el-card shadow="hover" style="margin-bottom: 20px;">
        <div class="summary-item">
          <span class="label">您的得分：</span>
          <span class="value score">{{ score }}</span>
        </div>
        <div class="summary-item">
          <span class="label">您的排名：</span>
          <span class="value rank">{{ rank || '获取中...' }}</span>
        </div>
      </el-card>
    </div>

    <h3>答题详情</h3>
    <div class="answer-details">
      <el-collapse v-model="activeNames">
        <el-collapse-item 
          v-for="(item, index) in answer" 
          :key="index" 
          :title="`第 ${index + 1} 题: ${item.question}`"
          :name="index.toString()"
        >
          <div class="answer-content">
            <div class="answer-item">
              <span class="answer-label">您的答案：</span>
              <span class="answer-value user-answer">{{ JSON.stringify(item.userAnswer) }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">正确答案：</span>
              <span class="answer-value correct-answer">{{ JSON.stringify(item.correctAnswer) }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">答题结果：</span>
              <span 
                class="answer-value result" 
                :class="JSON.stringify(item.userAnswer) === JSON.stringify(item.correctAnswer) ? 'correct' : 'wrong'"
              >
                {{ JSON.stringify(item.userAnswer) === JSON.stringify(item.correctAnswer) ? '正确' : '错误' }}
              </span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="result-actions">
      <el-button type="primary" @click="$router.push('/examList')">返回考试列表</el-button>
      <el-button @click="$router.push('/record')">查看我的所有考试记录</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
#resultContainer {
  width: 70%;
  margin: 20px auto 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    text-align: center;
  }

  h3 {
    margin: 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.result-summary {
  margin-bottom: 30px;
}

.summary-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .label {
    font-size: 16px;
    color: #606266;
    margin-right: 10px;
  }

  .value {
    font-size: 18px;
    font-weight: 600;
  }

  .score {
    color: #67c23a;
  }

  .rank {
    color: #e6a23c;
  }
}

.answer-details {
  margin-bottom: 30px;
}

.answer-content {
  padding: 10px 0;
}

.answer-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;

  .answer-label {
    font-weight: 500;
    color: #606266;
    width: 100px;
    flex-shrink: 0;
  }

  .answer-value {
    color: #303133;
    flex: 1;
  }

  .result {
    font-weight: 600;
  }

  .result.correct {
    color: #67c23a;
  }

  .result.wrong {
    color: #f56c6c;
  }
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>
