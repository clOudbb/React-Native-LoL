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
import {userModel} from '../../Models/LOLUserModel'
import {LOLMineTipImage} from "./LOLMineTipImage";


export class LOLMineHeadView extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            positionY : new Animated.Value(40),
        }
    }

    componentDidMount(){
        this.tipAnimation()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    tipAnimation(){
        let value = 60
        value = this.state.positionY._value===60?40:60
        Animated.timing(this.state.positionY,{
            toValue: value,
            duration:1000,
        }).start(()=>this.tipAnimation())
    }


    _renderItem = () => {
        return (
            <View style={styles.cellLaytout}>
                <Image style={styles.imageViewLayout} source={{uri: 'http://5b0988e595225.cdn.sohucs.com/images/20170906/30afe68566ec4963b1e1439dd7ca0212.jpeg'}}/>
                <Text style={styles.SummonnerName}>{userModel.name}</Text>
                <Animated.View style={{
                    position:'absolute',
                    top: this.state.positionY,
                    left: 70,
                    backgroundColor:'#eeeeee',
                    borderRadius:10,
                    paddingLeft:20,
                    paddingRight:20,
                }}>
                    <LOLMineTipImage content='大神' style={{

                    }}/>
                </Animated.View>
            </View>
        )
    }

    render(){
        return(
            this._renderItem()
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
        flexDirection:'column',
        width:Dimensions.get('window').width,
        justifyContent:'center',
        height : 200,
        alignItems:'center',
        backgroundColor:'#03A89E',
    },

    imageViewLayout:{
        width:70,
        height:70,
        borderRadius: 35,
    },

    SummonnerName : {
        marginTop:20,
        fontSize: 17,
        fontFamily:'Helvetica Bold',
    }

});