/**
 * Created by zhangzhenghong on 2017/11/27.
 */
import React,{Component, PropTypes} from 'react';
import {
    fetch,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import {
    createStore,
    combineReducers,
} from 'redux'

import {
    connect,
} from 'react-redux'

export const _scrollViewState = '_scrollViewState'

// export const rootReducer = combineReducers({
//     _scrollViewState : scrollReducerHandle,
// })

const initParams = {
    value : 0,
}
export const store = createStore(scrollReducerHandle, initParams)

const _animLineLeft = 15
function scrollReducerHandle(state, action) {
    switch (action.type) {
        case _scrollViewState:
            let s = reduxScrollValueReducer(action.index)
            return s
        default:
            return initParams
    }
}

export const reduxScrollValueReducer = (index)=> {
    let v = index * Dimensions.get('window').width / 4 + _animLineLeft
    return {
        value :v,
    }
}

/**
 * @param type => action name *require
 * @param index
 */
export const reduxScrollValue = (type, index) =>
{
    return (
        {
            type : type,
            index,
        }
    )
}

/**
 * 以上是利用redux管理全局state，个人理解并不一定要都用redux来管理所有state
 * redux本身有些繁琐，如果是局部state，不会影响外部的，就没必要使用redux
 *
 * 目前对react-redux的connect方法和provide还没有理解。
 * react全家桶还有一些控件暂时没有用到
 */