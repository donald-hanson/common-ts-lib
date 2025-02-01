import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk, AppDispatch } from '../';
import { LoginUsernamePasswordRequest, IdentityApi, IsApiError, BaseApi } from '../../api';

export type UserInfo = {
    tid: string
    sub: string
    name: string
    family_name: string
    given_name: string
    email: string
}

export interface IdentityState
{
    user?:UserInfo
}

const initialState:IdentityState = {
    
};

const identitySlice = createSlice({
	name: 'identity',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
        userUpdated:(state, action:PayloadAction<UserInfo>) => {
            state.user = {...action.payload};
        }
	}
});

export const { } = identitySlice.actions


export const loginUsernamePassword = (args:LoginUsernamePasswordRequest): AppThunk<Promise<boolean>> => async (dispatch:AppDispatch, getState:() => RootState) => {
    const result = await IdentityApi.loginUsernamePassword({
        ...args
    });
    if (IsApiError(result))
    {
        return false;
    }

    BaseApi.setAccessToken(result.access_token);

    const userInfo = await IdentityApi.getUserInfo();
    if (IsApiError(userInfo))
    {
        return false;
    }

    dispatch(identitySlice.actions.userUpdated(userInfo))
    
    return true;
}


export const reducer = identitySlice.reducer