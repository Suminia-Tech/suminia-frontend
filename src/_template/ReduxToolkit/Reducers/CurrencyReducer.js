import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currency: 'USD',
    name: 'dollar',
    symbol: '$',
    currencyValue: 1
};

const CurrencyReducer = createSlice({
  name: "currency",
  initialState,
  reducers: {
    CURRENCYCHANGE: (state, action) => {
      const { currency, name, symbol, value } = action.payload;
      state.currency = currency;
      state.name = name;
      state.symbol = symbol;
      state.currencyValue = value;
    },
  },
});

export const { CURRENCYCHANGE } = CurrencyReducer.actions;
export default CurrencyReducer.reducer;
