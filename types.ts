import React from 'react';

declare const html2pdf: any;

export interface QuestionFormData {
  schoolName: string;
  examType: string;
  classLevel: string;
  section: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: string;
  chapters: string;
  questionType: 'MCQ' | 'Short' | 'Long' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionCount: number;
  otherInstructions: string; // Maps to other_specific_details
  userPromptOptional: string; // Maps to the left side box
}

export interface Question {
  q_id: string;
  q_text: string;
  q_type: string;
  difficulty: string;
  topic: string;
  marks_allocated: number;
  estimated_time_mins: number;
  answer_key: string;
  explanation: string;
}

export interface PaperSection {
  section_name: string;
  type: string;
  questions: Question[];
}

export interface StructuredPaperData {
  header: {
    school_name: string;
    basic_formal_box: {
      exam_type: string;
      class: string;
      section: string;
      subject: string;
      date: string;
      duration: string;
      total_marks: string;
    };
    other_specific_details_box: {
      sections_in_exam: string;
      basic_instructions: string;
      marks_distribution: string;
      total_questions: string;
      custom_details: string;
    };
    user_prompt_box_optional: string;
  };
  sections: PaperSection[];
  metadata: {
    generator_version: string;
    generation_time: string;
    school_style_applied: string;
  };
}

export interface GeneratedPaper {
  id: string;
  title: string;
  content: StructuredPaperData; // Updated to store structured JSON
  schoolName: string;
  classLevel: string;
  subject: string;
  date: string;
  timestamp: number;
  formData: QuestionFormData;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}