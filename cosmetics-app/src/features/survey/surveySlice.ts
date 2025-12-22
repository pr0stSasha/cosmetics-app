import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SurveyAnswers } from '../../types';

interface SurveyState {
  answers: SurveyAnswers;
}

const initialState: SurveyState = {
  answers: {},
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setAnswer(state, action: PayloadAction<{ question: string; value: boolean }>) {
      state.answers[action.payload.question] = action.payload.value;
    },
    resetSurvey(state) {
      state.answers = {};
    },
  },
});

export const { setAnswer, resetSurvey } = surveySlice.actions;
export default surveySlice.reducer;
