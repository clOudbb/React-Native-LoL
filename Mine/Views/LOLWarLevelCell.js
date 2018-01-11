/**
 * Created by zhangzhenghong on 2018/1/11.
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

export class LOLWarLevelCell extends React.Component
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
                    <View style={styles.cellContainStyle}>

                        <View style={styles.cellTextLayout}>
                            <Image style={styles.imageViewLayout}
                                   source={require('../../Image/lol_challenger.jpeg')}
                            />
                        </View>
                        <View style={{
                            position:'absolute',
                            backgroundColor:'#cccccc',
                            height:130,
                            width:0.5,
                            top:10,
                            bottom:10
                        }}>

                        </View>
                    </View>
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
        height : 150,
        alignItems:'center',
        backgroundColor:'#cccccc',
    },

    cellTouchableStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },

    cellContainStyle:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        // marginTop:5,
        // marginBottom:0,
        // marginLeft:10,
        // marginRight:10,
        backgroundColor:'#cccccc',
    },

    cellTextLayout:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'#FFFFFF',
        marginLeft : 0,
        marginTop: 0,
    },

    imageViewLayout:{
        width:150,
        height: 150,
        borderRadius:4,
        marginRight: cellMargin,
    },


});