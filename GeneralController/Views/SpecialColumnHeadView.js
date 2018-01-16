/**
 * Created by zhangzhenghong on 2018/1/16.
 */
import {
    store,
    reduxScrollValue,
    _reduxSubscribeType,
    mapDispatchProps,
    mapToSubScribe,
    reduxUpdateControl,
} from '../../DataManager/ReduxManager'
import {
    connect,
} from 'react-redux'

import React, { Component } from 'react';

import {
    loldingYuePageHeadApi,
    lolDingYuePageApi,
    _handleCount,
    kScreenWidth,
    kScreenHeight,
    naviBarHeight,
    tabBarHeight,
    cellMargin,
    tableViewTop,
    statusBarHeight,
} from '../../RemoteManager';

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
    Image,
} from 'react-native';

export default class SpecialColumnHeadView extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            isRefreshing:false,
        }

    }

    componentDidMount() {

    }


    setNativeProps(props){
        this.e.setNativeProps(props)
    }

    _getIsSubState(){
        const { store } = this.props;
        const state = store.getState();
        if (!state._subscribeArray) return false;
        let subscribeArray = state._subscribeArray
        let isSub = false
        for (let i = 0;i < subscribeArray.length;i++) {
            let model = subscribeArray[i]
            if (model.index === this.props.index && model.section === this.props.section) {
                isSub = model.isSub
            }
        }
        return isSub
    }

    render(){
        let item = this.props.item
        let style = this.props.style
        isButtonSub = this._getIsSubState()
        return(
            <View style={style} ref={(e)=>this.e=e}>
                <View style={styles.cellContainViewStyle}>
                    <Image source={{uri:item.logo}} style={styles.imageViewLayout}/>
                    <View style={{flex:1,
                        marginLeft:cellMargin,
                        marginRight:cellMargin,
                    }}>
                        <Text style={{fontSize:20}}>{item.col_title}</Text>
                        <View style={{marginTop:10,}}>
                            <Text style={{fontSize:16, color:'#b1b1b1'}}>
                                {item.author}
                            </Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize:14, marginTop:10, color:'#cccccc',
                        position:'absolute',
                        left:cellMargin,
                        right:cellMargin,
                        bottom:cellMargin,
                    }} numberOfLines={1}>{item.col_des}</Text>
                    <TouchableHighlight onPress={()=>this._subsriAction()}
                                        underlayColor='#cccccc' style={[styles.subscribeButton, isButtonSub?{backgroundColor:'#802a2a'}:null]}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={isButtonSub?{fontSize:16, color:'#ffffff'}:{fontSize:16, color:'#802A2A'}}>
                                {isButtonSub?'已订阅':'订阅'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}


let isButtonSub = false

const styles = StyleSheet.create({
    columnViewContainer: {
        backgroundColor: '#FFFFFF',
        width:kScreenWidth,
        height:kScreenHeight
    },

    tableViewLayout: {
        marginTop:0,
        marginBottom:0,
        marginLeft:0,
        marginRight:0,
        backgroundColor:'white',
    },

    cellContainViewStyle: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:200,
        width:kScreenWidth,
    },

    textLayout:{
        left : cellMargin,
    },

    imageViewLayout:{
        width:50,
        height:50,
        borderRadius: 25,
        marginLeft: cellMargin,
    },

    subscribeButton:{
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        width:70,
        height:30,
        borderColor:'#802A2A',
        borderRadius:4,
        position:'absolute',
        right:cellMargin,
        top:70,
    },

    headerViewStyle:{
        backgroundColor:'#2E8B57',
    }
});