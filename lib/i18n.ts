import type { Language } from '../types';

const translations = {
  // Header
  title: {
    en: 'WarrenT Startup School',
    zh: 'WarrenT 创业学院',
  },
  tagline: {
    en: 'The AI-Powered Path from Idea to Impact',
    zh: '人工智能驱动的从创意到影响力的路径',
  },
  // Idea Input
  ideaTitle: {
    en: 'What is your startup idea?',
    zh: '你的创业想法是什么？',
  },
  ideaSubtitle: {
    en: 'A startup roadmap tailored to your project.',
    zh: '根据您的项目定制的创业地图。',
  },
  ideaPlaceholder: {
    en: 'e.g., An AI-powered tool that automatically translates and dubs videos into any language.',
    zh: '例如，一个能自动将视频翻译并配音成任何语言的AI工具。',
  },
  ideaButton: {
    en: 'Create My Course',
    zh: '创建我的课程',
  },
  // App
  courseOutline: {
    en: 'Course Outline',
    zh: '课程大纲',
  },
  loadingCurriculum: {
    en: 'Generating your personalized curriculum...',
    zh: '正在生成您的个性化课程...',
  },
  errorTitle: {
    en: 'An Error Occurred',
    zh: '发生错误',
  },
  errorCurriculum: {
    en: 'Failed to generate the curriculum. Please check your API key and try again.',
    zh: '无法生成课程。请检查您的API密钥并重试。',
  },
  retry: {
    en: 'Retry',
    zh: '重试',
  },
  congratsTitle: {
    en: 'Congratulations!',
    zh: '恭喜！',
  },
  generatePlanTitle: {
    en: "You've Mastered the Essentials!",
    zh: '您已掌握所有核心知识！',
  },
  generatePlanBody: {
    en: "You've successfully completed the WarrenT curriculum. As a final step, let's consolidate your work into a comprehensive business plan.",
    zh: '您已成功完成 WarrenT 课程。作为最后一步，让我们将您的所有作业整合成一份全面的商业计划书。',
  },
  generatePlanButton: {
    en: 'Generate My Business Plan',
    zh: '生成我的商业计划书',
  },
  generatingPlan: {
    en: 'Generating your detailed business plan...',
    zh: '正在生成您的详细商业计划书...',
  },
  // StageDetail
  loadingContent: {
    en: 'Generating stage content with AI...',
    zh: '正在用 AI 生成阶段内容...',
  },
  errorContentTitle: {
    en: 'Content Loading Error',
    zh: '内容加载错误',
  },
  selectStagePrompt: {
    en: 'Select a stage to begin your journey.',
    zh: '请选择一个阶段开始您的学习之旅。',
  },
  theory: {
    en: 'Theory',
    zh: '理论',
  },
  caseStudy: {
    en: 'Case Study',
    zh: '案例研究',
  },
  practicalExercise: {
    en: 'Practical Exercise',
    zh: '实践练习',
  },
  assignment: {
    en: 'Assignment',
    zh: '课堂作业',
  },
  assignmentPlaceholder: {
    en: 'Type your assignment submission here...',
    zh: '在此处输入您的作业...',
  },
  submitForGrading: {
    en: 'Submit for Grading',
    zh: '提交评分',
  },
  grading: {
    en: 'Grading...',
    zh: '评分中...',
  },
  assignmentComplete: {
    en: 'Assignment Complete',
    zh: '作业已完成',
  },
  yourSubmission: {
    en: 'Your Submission',
    zh: '您提交的内容',
  },
  aiFeedback: {
    en: 'AI Feedback',
    zh: 'AI 反馈',
  },
  score: {
    en: 'Score',
    zh: '分数',
  },
  // Business Plan
  planTitle: {
    en: 'Your Business Plan',
    zh: '您的商业计划书',
  },
  downloadPlan: {
    en: 'Download Plan (.md)',
    zh: '下载计划书 (.md)',
  },
  // Navigation
  back: {
    en: 'Back',
    zh: '返回',
  },
  continueTo: {
    en: 'Continue to',
    zh: '继续学习',
  },
  goToAssignment: {
    en: 'Go to Assignment',
    zh: '去做作业',
  },
};

export const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key]?.[lang] || key;
};