/**
 * Created by zhangzhenghong on 2018/1/9.
 */

import React, { Component } from 'react';
import {_handleCount, kScreenHeight} from '../../RemoteManager'

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SectionList,
    TouchableHighlight,
    Animated,
    Image,
} from 'react-native';

export class LOLMineHeadView extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){

    }


    _renderItem = (item, index) => {
        return (
            <View style={styles.cellLaytout}>
                <Image style={styles.imageViewLayout}/>
            </View>
        )
    }

    render(){
        return(
            this._renderItem(this.props.item, this.props.index)
        )
    }
}

const naviBarHeight = (kScreenHeight>=812?88:64)
const tabBarHeight = (kScreenHeight>=812?83:49)
const cellMargin = 10;
const tableViewTop = (kScreenHeight>=812?44:0)
const statusBarHeight = (kScreenHeight>=812?44:20)
const styles = StyleSheet.create({

    cellLaytout:{
        flex:1,
        flexDirection:'row',
        width:Dimensions.get('window').width,
        justifyContent:'center',
        height : 100,
        alignItems:'center',
        backgroundColor:'#cccccc',
    },

    imageViewLayout:{
        width:50,
        height:50,
        borderRadius: 25,
    },

});