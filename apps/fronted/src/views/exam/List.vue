<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { type AddExamDto, Api, type Exam } from '@/api/examApi'
import { useRouter } from 'vue-router'
import {
  Plus,
  Search,
  Sort,
  Filter,
  DocumentDelete,
  Star,
  Folder,
  Edit,
  Share,
  DataAnalysis,
  CopyDocument,
  Delete,
  FolderOpened,
  Bell,
  ChatLineRound,
} from '@element-plus/icons-vue'

// 问卷列表数据
const router = useRouter()
const api = new Api().exam
let questionnaireList = ref<Exam[]>([])

// 导航菜单激活项
const activeNavItem = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 时间排序方式
const timeSort = ref('')

// 状态筛选
const statusFilter = ref('')
const addExamFormVisible = ref(false)
// 模拟操作方法
const handleCreateQuestionnaire = () => {
  console.log('创建问卷')
  addExamFormVisible.value = true
}

const handleTestDesign = (id: number) => {
  console.log('考试设计', id)
  router.push({
    name: 'edit',
    params: { id },
  })
}

const handleSendTest = (id: number) => {
  router.push({
    path: `/exam/${id}`,
    params: {
      id,
    },
  })
  console.log('发送考试', id)
}

const handleScoreData = (id: number) => {
  console.log('成绩数据', id)
}

const handlePublish = async (id: number) => {
  console.log('发布', id)
  await api.examControllerPublish(String(id))
  await getExamList()
}

const handleStop = (id: number) => {
  console.log('停止', id)
}

const handleCopy = (id: number) => {
  console.log('复制', id)
}

const handleDelete = async (id: number) => {
  console.log('删除', id)
  await api.examControllerDel(String(id))
  await getExamList()
}
const clickRecycle = async () => {
  console.log('点击回收站')
  activeNavItem.value = 'recycle'
  const res = await api.examControllerList({
    bin: 'true',
  })
  console.log('获取回收站问卷列表结果:', res)
  questionnaireList.value = res
}
const clickAll = async () => {
  console.log('点击全部')
  activeNavItem.value = 'all'
  const res = await api.examControllerList({
    bin: 'false',
  })
  console.log('获取全部列表结果:', res)
  questionnaireList.value = res
}
const handleFolder = (id: number) => {
  console.log('文件夹', id)
}

const handleRemind = (id: number) => {
  console.log('提醒', id)
}
const addExamForm = reactive<AddExamDto>({
  name: '',
})
// 确认添加问卷
const confirmAddExamForm = async () => {
  console.log('确认添加问卷')
  const res = await api.examControllerAddExam(addExamForm)
  console.log('添加问卷结果:', res)
  addExamFormVisible.value = false
  await getExamList()
}
const getExamList = async () => {
  const res = await api.examControllerList({
    bin: 'false',
  })
  console.log('获取问卷列表结果:', res)
  // 将API返回的Exam实体数据映射到列表所需格式
  questionnaireList.value = res
}

// 组件挂载时获取问卷列表
onMounted(() => {
  getExamList()
})
</script>

<template>
  <div class="questionnaire-list-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo-section">
        <h1 class="logo">问卷星</h1>
      </div>

      <!-- 创建问卷按钮 -->
      <el-button type="primary" class="create-btn" :icon="Edit" @click="handleCreateQuestionnaire">
        创建问卷
      </el-button>

      <!-- 导航菜单 -->
      <ul class="nav-menu">
        <li class="nav-item" :class="{ active: activeNavItem === 'all' }" @click="clickAll">
          <el-icon class="nav-icon">
            <Folder />
          </el-icon>
          <span>全部问卷</span>
        </li>
        <li
          class="nav-item"
          :class="{ active: activeNavItem === 'star' }"
          @click="activeNavItem = 'star'"
        >
          <el-icon class="nav-icon">
            <Star />
          </el-icon>
          <span>星标问卷</span>
        </li>
        <li class="nav-item" :class="{ active: activeNavItem === 'recycle' }" @click="clickRecycle">
          <el-icon class="nav-icon">
            <DocumentDelete />
          </el-icon>
          <span>回收站</span>
        </li>
        <li
          class="nav-item"
          :class="{ active: activeNavItem === 'folder' }"
          @click="activeNavItem = 'folder'"
        >
          <el-icon class="nav-icon">
            <FolderOpened />
          </el-icon>
          <span>文件夹</span>
        </li>
      </ul>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <!-- 顶部工具栏 -->
      <div class="top-toolbar">
        <div class="toolbar-left">
          <h2 class="page-title">问卷列表</h2>
        </div>

        <div class="toolbar-right">
          <!-- 搜索框 -->
          <el-input
            v-model="searchKeyword"
            placeholder="请输入问卷名进行搜索..."
            prefix-icon="Search"
            class="search-input"
            clearable
          />
        </div>
      </div>

      <!-- 问卷列表 -->
      <div class="questionnaire-list">
        <div v-for="item in questionnaireList" :key="item.id" class="questionnaire-item">
          <!-- 问卷基本信息 -->
          <div class="questionnaire-header">
            <div class="questionnaire-title">
              <h3>{{ item.name }}</h3>
              <el-tag :type="item.isDelete ? 'danger' : 'success'" size="small">{{
                item.isDelete ? '已删除' : '正常'
              }}</el-tag>
            </div>

            <div class="questionnaire-meta">
              <span class="meta-item">ID:{{ item.id }}</span>
              <el-tag :type="item.isPublish ? 'success' : 'info'" size="small" class="status-tag">
                {{ item.isPublish ? '已发布' : '未发布' }}
              </el-tag>
              <span class="meta-item">{{ item.createTime }}</span>
            </div>
          </div>

          <!-- 问卷操作按钮组 -->
          <div class="questionnaire-actions">
            <div class="action-group">
              <el-button type="primary" size="small" link @click="handleTestDesign(item.id)">
                <el-icon class="mr-1">
                  <Edit />
                </el-icon>
                设计题目
              </el-button>
              <el-button type="primary" size="small" link @click="handleSendTest(item.id)">
                <el-icon class="mr-1">
                  <Share />
                </el-icon>
                发送考试
              </el-button>
              <el-button type="primary" size="small" link @click="handleScoreData(item.id)">
                <el-icon class="mr-1">
                  <DataAnalysis />
                </el-icon>
                成绩数据
              </el-button>
            </div>

            <div class="action-buttons">
              <el-button
                :type="item.isPublish ? 'warning' : 'success'"
                size="small"
                @click="item.isPublish ? handleStop(item.id) : handlePublish(item.id)"
              >
                {{ item.isPublish ? '已发布' : '发布' }}
              </el-button>

              <el-button type="default" size="small" @click="handleCopy(item.id)">
                <el-icon>
                  <CopyDocument />
                </el-icon>
              </el-button>

              <el-button type="default" size="small" @click="handleDelete(item.id)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>

              <el-button type="default" size="small" @click="handleFolder(item.id)">
                <el-icon>
                  <FolderOpened />
                </el-icon>
              </el-button>

              <el-button type="default" size="small" @click="handleRemind(item.id)">
                <el-icon>
                  <Bell />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右下角咨询按钮 -->
    <div class="consult-btn">
      <el-button type="primary" circle>
        <el-icon size="20">
          <ChatLineRound />
        </el-icon>
      </el-button>
    </div>
    <el-dialog v-model="addExamFormVisible" title="添加问卷" width="500">
      <el-form :model="addExamForm">
        <el-form-item label="问卷名称" :label-width="'auto'">
          <el-input v-model="addExamForm.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addExamFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddExamForm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.questionnaire-list-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--main-bg);
  // 左侧导航栏
  .sidebar {
    width: 200px;
    border-right: 1px solid var(--border-primary);
    padding: 20px;
    display: flex;
    flex-direction: column;

    .logo-section {
      margin-bottom: 30px;

      .logo {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        color: var(--text-primary);
      }
    }

    .create-btn {
      text-align: center;
      width: 100%;
      margin-bottom: 20px;
      border: none;

      &:hover {
        background-color: var(--btn-primary-hover);
      }
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;

      .nav-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-secondary);
        margin-bottom: 5px;

        &:hover {
          background-color: var(--bg-hover);
          color: var(--btn-primary);
        }

        &.active {
          background-color: var(--bg-tertiary);
          color: var(--btn-primary);
          font-weight: 500;
        }

        .nav-icon {
          margin-right: 10px;
          font-size: 16px;
        }
      }
    }
  }

  // 右侧主内容区
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    // 顶部工具栏
    .top-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .toolbar-left {
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
      }

      .toolbar-right {
        display: flex;
        align-items: center;
        gap: 15px;

        .toolbar-item {
          .toolbar-btn {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 4px;
            transition: all 0.3s ease;
            color: var(--text-secondary);

            &:hover {
              background-color: var(--bg-hover);
              color: var(--btn-primary);
            }
          }
        }

        .search-input {
          width: 300px;
          background-color: var(--bg-card);
          border-color: var(--border-primary);
        }
      }
    }

    // 问卷列表
    .questionnaire-list {
      display: flex;
      flex-direction: column;
      gap: 15px;

      // 问卷项
      .questionnaire-item {
        background-color: var(--bg-card);
        border-radius: 8px;
        padding: 20px;
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;

        &:hover {
          box-shadow: var(--shadow-md);
        }

        // 问卷头部信息
        .questionnaire-header {
          margin-bottom: 15px;

          .questionnaire-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;

            h3 {
              font-size: 16px;
              font-weight: 600;
              color: var(--text-primary);
              margin: 0;
            }

            .copy-tag {
              background-color: var(--tag-copy-bg);
              color: var(--tag-copy-text);
              border-color: var(--tag-copy-border);
            }

            .exam-tag {
              background-color: var(--tag-exam-bg);
              color: var(--tag-exam-text);
              border-color: var(--tag-exam-border);
            }
          }

          .questionnaire-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 12px;
            color: var(--text-tertiary);

            .meta-item {
              display: inline-block;
            }

            .status-tag {
              font-size: 10px;
            }
          }
        }

        // 问卷操作按钮
        .questionnaire-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .action-group {
            display: flex;
            gap: 15px;

            :deep(.el-button--link) {
              padding: 0;
              height: auto;
              line-height: normal;
              font-size: 13px;
              color: var(--btn-primary);
            }
          }

          .action-buttons {
            display: flex;
            gap: 8px;

            :deep(.el-button) {
              padding: 4px 8px;
              font-size: 12px;
            }

            :deep(.el-button--default) {
              background-color: var(--btn-default);
              border-color: var(--border-primary);
              color: var(--text-secondary);
            }
          }
        }
      }
    }
  }

  // 右下角咨询按钮
  .consult-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;

    :deep(.el-button--primary) {
      background-color: var(--btn-primary);
      border: none;
      width: 50px;
      height: 50px;

      &:hover {
        background-color: var(--btn-primary-hover);
      }
    }
  }
}
</style>
