/**
 * Created by zhangzhenghong on 2017/11/23.
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

export class GeneralControllerCell extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){

    }

    _touchAction(item, index){
        this.props._touchAction(item, index)
    }

    _renderItem = (item, index) => {
        return (
            <View style={styles.cellLaytout}>

                <TouchableHighlight style={styles.cellTouchableStyle}
                                    onPress={()=>{this._touchAction(item, index)}}>
                    <View style={styles.cellContainStyle}>

                        <View style={styles.cellTextLayout}>
                            <Text style={styles.textLayout} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.summaryTextStyle} numberOfLines={2}>{item.summary}</Text>
                            <Text style={[styles.summaryTextStyle, styles.dateTextStyle]}>
                                {item.publication_date + ' '}
                                <Text style={styles.summaryTextStyle}>{_handleCount(item) + '万阅'}</Text>
                            </Text>
                        </View>
                        <Image style={styles.imageViewLayout}
                               source={{uri:item.image_url_small}}
                        />
                        <View style={{
                            position:'absolute',
                            backgroundColor:'#cccccc',
                            height:0.5,
                            left:20,
                            right:20,
                            bottom:0
                        }}>

                        </View>
                    </View>


                </TouchableHighlight>

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
        backgroundColor:'#ffffff',
    },

    cellTextLayout:{
        flex:1,
        flexDirection:'column',
        height:90,
        justifyContent:'flex-start',
        backgroundColor:'#FFFFFF',
        marginLeft : 0,
        marginTop: 0,
    },

    textLayout:{
        marginLeft:10,
        fontSize:18,
        marginRight:cellMargin,
        marginTop:10,
    },

    summaryTextStyle:{
        fontSize:14,
        color:'gray',
        marginLeft:10,
        marginRight:cellMargin,
    },

    dateTextStyle:{
        position:'absolute',
        bottom: 5,
    },

    textLayout_second:{
        marginTop:20,
    },

    imageViewLayout:{
        width:90,
        height: 70,
        borderRadius:4,
        marginRight: cellMargin,
    },

    cellButtonLaytout:{
        width: 20,
        height: 30,
        marginRight : 20,
        flex: 0.5,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    },
    cellButtonFont:{
        fontSize:18,
    },

});