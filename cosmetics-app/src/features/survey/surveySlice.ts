import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SurveyState {
  skinType: string;
  colorType: string;
}

// По умолчанию ставим "Все", чтобы в начале показывались все товары
const initialState: SurveyState = {
  skinType: 'Все',
  colorType: 'Все',
};

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    // Этот экшен мы будем вызывать при клике в профиле
    setPreference: (state, action: PayloadAction<{field: keyof SurveyState, value: string}>) => {
      state[action.payload.field] = action.payload.value;
    },
  },
});

export const { setPreference } = surveySlice.actions;
export default surveySlice.reducer;