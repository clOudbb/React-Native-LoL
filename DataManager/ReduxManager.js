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
import BaseNavigationController from '../index.ios'

export const _scrollViewState = '_scrollViewState'  //底部视图滚动事件
export const _reduxSubscribeType = '_reduxSubscribeType'  //模拟订阅

// export const rootReducer = combineReducers({
//     _scrollViewState : scrollReducerHandle,
// })
const _animLineLeft = 15
const initParams = {
    _linePositionX : _animLineLeft,
    _subscribeArray : []
}
export const store = createStore(scrollReducerHandle, initParams)

function scrollReducerHandle(state, action) {
    switch (action.type) {
        case _scrollViewState:
            let s = reduxScrollValueReducer(action.index)
            return s
        case _reduxSubscribeType:
            return reduxSubscribeState(action.section, action.index, action.isSub)
        default:
            return initParams
    }
}


/** call back state */
export const reduxScrollValueReducer = (index)=> {
    let v = index * Dimensions.get('window').width / 4 + _animLineLeft
    // let lineArr = [true, false, false,  false,  false]
    // for (let i = 0;i < lineArr.count;i++) {
    //     if (i == index) {
    //         lineArr[index] = true
    //     } else {
    //         lineArr[i] = false
    //     }
    // }
    return {
        _linePositionX : v,
    }
}

export const reduxSubscribeState = (section, index, isSub) => {
    let subArr = initParams._subscribeArray
    if (isSub === false) {
        let isHave = false
        for (let i = 0;i < subArr.length; i++) {
            let model = subArr[i]
            if (section === model.section && index === model.index) {
                isHave = true
                model.isSub = true
            }
        }
        if (!isHave) {
            let model = new Object()
            model.section = section
            model.index = index
            model.isSub = true
            subArr.push(model)
        }
    } else {
        for (let i = 0;i < subArr.length; i++) {
            let model = subArr[i]
            if (section === model.section && index === model.index) {
                model.isSub = false
            }
        }
    }
    return {
        _subscribeArray: subArr
    }
}

/**   dispatch  */
/**
 * 视图页滚动事件
 * @param type => action name *require
 * @param index
 */
export const reduxUpdateControl = {
    update: false
}
export const reduxScrollValue = (type, index) =>
{
    return (
        {
            type : type,
            index,
        }
    )
}

export const reduxSubscribe = (type, section, index, isSub) =>
{
    return (
        {
            type : type,
            index,
            section,
            isSub,
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


/**   map  */

export const mapToState = (state)=>{
    return {
        store: store,
        state,
    }
}

export const mapToSubScribe = (state)=>{
    return {
        store: store,
        subscribeArray:state._subscribeArray
    }
}

export const mapDispatchProps = (dispatch)=>{
    return {
        _scrollValue : (type, index)=>{
            dispatch(reduxScrollValue(type, index))
        },

        _subscribe : (type, section, index, isSubscribe) => {
            dispatch(reduxSubscribe(type, section, index, isSubscribe))
        }
    }
}


