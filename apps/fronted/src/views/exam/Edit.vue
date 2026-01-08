<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Api } from '@/api/examApi'
import { Sort } from '@element-plus/icons-vue'
import QuestionComponent from './Question.vue'
import Radio from './Radio.vue'
import Checkbox from './Checkbox.vue'
import Input from './Input.vue'
import Preview from './Preview.vue'
import { type Question } from '@/types'
import { ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const api = new Api().exam

const route = useRoute() // 直接获取路由对象

const getExamById = async () => {
  const res = await api.examControllerDetail(String(route.params.id))
  const content = JSON.parse(res.content)
  questionList.value = content // 初始化题目列表
  console.log(res)
}
onMounted(() => {
  getExamById()
})
const questionDialogVisible = ref(false)
const currentQuestionType = ref('radio') // 当前选择的问题类型
const openQuestionDialog = (type: string) => {
  currentQuestionType.value = type
  questionDialogVisible.value = true
}
const closeQuestionDialog = () => {
  questionDialogVisible.value = false
}
const questionList = ref<Question[]>([]) // 把初始 json 转为响应式
const radioRef = ref() // 用于绑定单选组件实例
const checkboxRef = ref() // 用于绑定多选组件实例
const inputRef = ref() // 用于绑定填空组件实例
const previewVisible = ref(false) // 预览对话框可见状态

const handleConfirm = () => {
  let newData: any
  let refInstance: any

  // 根据当前问题类型获取相应的组件实例和数据
  switch (currentQuestionType.value) {
    case 'radio':
      refInstance = radioRef.value
      newData = radioRef.value.getQuestionData()
      break
    case 'checkbox':
      refInstance = checkboxRef.value
      newData = checkboxRef.value.getQuestionData()
      break
    case 'input':
      refInstance = inputRef.value
      newData = inputRef.value.getQuestionData()
      break
    default:
      return ElMessage.warning('未知的问题类型')
  }

  if (!newData.question) return ElMessage.warning('请输入题干')
  if (!newData.answer) return ElMessage.warning('请输入正确答案')

  questionList.value.push({
    id: questionList.value.length + 1,
    ...newData,
  })

  refInstance.resetForm() // 添加完重置
  questionDialogVisible.value = false
}
const changeQuestion = (id: number) => {
  const target = questionList.value.find((q) => q.id === id)
  if (target) {
    nowQuestion.value = target // 建立引用关系
  }
}
const deleteQuestion = (id: number) => {
  questionList.value = questionList.value.filter((q) => q.id !== id)
  nowQuestion.value = null
}
let nowQuestion = ref<Question | null>(null)
const onDragEnd = () => {
  // 遍历当前已排好序的数组
  questionList.value.forEach((item, index) => {
    // 将 ID 设为当前索引 + 1，从而实现 1, 2, 3... 的排序
    item.id = index + 1
  })

  console.log('排名已重置：', questionList.value)
}
const saveExam = async () => {
  // 构造符合 SaveExamDto 要求的对象
  const saveData = {
    id: Number(route.params.id), // 考试 ID（通常从路由获取）
    content: JSON.stringify(questionList.value), // 将题目数组转为字符串
  }

  // 现在传给 API 就不会报错了
  await api.examControllerSave(saveData)
  ElMessage.success('保存成功')
}

// 打开预览
const openPreview = () => {
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
}
const model = {
  questions: questionList,
  visible: previewVisible.value,
}
// 处理预览提交的答案
const handlePreviewSubmit = (answers: Record<number, any>) => {
  console.log('预览提交的答案：', answers)
  ElMessage.success('预览提交成功，答案已在控制台打印')
}
</script>

<template>
  <div id="container">
    <div id="left">
      <div class="option" @click="openQuestionDialog('radio')">单选</div>
      <div class="option" @click="openQuestionDialog('checkbox')">多选</div>
      <div class="option" @click="openQuestionDialog('input')">填空</div>
      <div>
        <el-button style="width: 100%; margin-bottom: 5%" type="primary" @click="saveExam"
          >保存
        </el-button>
        <el-button style="width: 100%; margin: 0" type="info" @click="openPreview">预览</el-button>
      </div>
    </div>
    <div id="middle">
      <VueDraggable
        v-model="questionList"
        :animation="150"
        handle=".drag-handle"
        ghost-class="ghost"
        class="draggable-container"
        @end="onDragEnd"
      >
        <div
          v-for="question in questionList"
          :key="question.id"
          class="question-item-wrapper"
          :class="{ 'active-item': nowQuestion?.id === question.id }"
          @click="changeQuestion(question.id)"
        >
          <QuestionComponent :question="question">
            <template #drag>
              <el-icon class="drag-handle">
                <Sort />
              </el-icon>
            </template>
          </QuestionComponent>
        </div>
      </VueDraggable>
    </div>
    <div id="right">
      <div v-if="nowQuestion" class="edit-panel">
        <h3>编辑题目信息 (ID: {{ nowQuestion.id }})</h3>
        <el-form label-position="top">
          <el-form-item label="题干内容">
            <el-input type="textarea" v-model="nowQuestion.question" rows="4" />
          </el-form-item>

          <el-form-item label="题目分值">
            <el-input-number v-model="nowQuestion.score" :min="1" />
          </el-form-item>
          <el-form-item>
            <el-tag>正确答案：{{ nowQuestion.answer }}</el-tag>
          </el-form-item>
          <el-form-item label="答案解析">
            <el-input type="textarea" v-model="nowQuestion.answerAnalyse" />
          </el-form-item>

          <div v-if="nowQuestion.options">
            <p>选项管理：</p>
            <div
              v-for="(opt, index) in nowQuestion.options"
              :key="index"
              style="margin-bottom: 5px"
            >
              <el-input v-model="nowQuestion.options[index]" size="small" />
            </div>
          </div>
          <el-tag type="danger" @click="deleteQuestion(nowQuestion.id)">删除</el-tag>
        </el-form>
      </div>
      <div v-else class="empty-tip">
        <el-empty description="请在中间区域选择一道题目进行编辑" />
      </div>
    </div>
    <el-dialog v-model="questionDialogVisible" title="添加题目" width="600">
      <!-- 根据当前问题类型显示不同的组件 -->
      <Radio v-if="currentQuestionType === 'radio'" :length="questionList.length" ref="radioRef" />
      <Checkbox
        v-else-if="currentQuestionType === 'checkbox'"
        :length="questionList.length"
        ref="checkboxRef"
      />
      <Input
        v-else-if="currentQuestionType === 'input'"
        :length="questionList.length"
        ref="inputRef"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="questionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 预览组件 -->
    <Preview
      v-model:questions="questionList"
      v-model:visible="previewVisible"
      @close="closePreview"
      @submit="handlePreviewSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
#container {
  display: flex;
  min-height: 100%;
}

/* 拖拽容器需要有一定高度，防止列表为空时无法拖入 */
.draggable-container {
  min-height: 800px;
  padding: 20px;
}

.question-item-wrapper {
  position: relative;
  margin-bottom: 20px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* 💡 选中状态的样式 */
.active-item {
  border: 2px solid #409eff;
  border-radius: 8px;
}

/* 💡 拖拽手柄样式 */
.drag-handle {
  cursor: grab;
  color: #909399;
  font-size: 20px;

  &:active {
    cursor: grabbing;
  }
}

/* 💡 拖拽时的占位符样式 (ghost-class) */
.ghost {
  opacity: 0.5;
  background: #ecf5ff;
  border: 2px dashed #409eff;
}

#left {
  padding: 2rem;
  flex: 1;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 1fr 1fr;

  /* 定义两行：每行高度 200px */
  grid-template-rows: 10% 10%;
  gap: 1rem;

  .option {
    border: 1px solid gray;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}

#middle {
  flex: 3;
  border: 1px solid black;
  min-height: 800px;
}

#right {
  flex: 1;
  border: 1px solid black;
}
</style>
