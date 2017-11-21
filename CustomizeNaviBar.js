/**
 * Created by zhangzhenghong on 2017/11/17.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight
} from 'react-native';


export default class CustomizeNavibar extends React.Component
{
    constructor(props){
        super(props)

    }

    componentDidMount() {

    }

    _setNativeProps(styless){
        console.log('naviBar reaceive = ' + styless.opacity)
        this._vi.setNativeProps({
            style : styless.style
        })
    }

    render(){
        return(
            <View style={styles.customizeNavibarStye} ref={(vi)=>this._vi=vi}>
                <View style={styles.containViewStyle}>
                    <View style={styles.titleContainViewStyle}>
                        <Text style={styles.titleStyle}>
                            Main
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const kScreenWidth = Dimensions.get('window').width
const kScreenHeight = Dimensions.get('window').height
const naviBarHeight = (kScreenHeight>=812?88:64)


const styles = StyleSheet.create({
    customizeNavibarStye:{
        backgroundColor:'white',
        width:kScreenWidth,
        height:naviBarHeight,
        borderBottomWidth:0.5,
        opacity:0,
        position:'absolute',
        borderBottomColor:'#cccccc',
        top:0,
    },

    containViewStyle:{
        flex:1,
        marginTop:0,
        marginBottom:0,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },

    titleContainViewStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:150,
        height:naviBarHeight,
    },

    titleStyle: {
        fontSize:18,
        textAlign:'center',
        color:'#000000',
        top:8,
        fontWeight:'500',
    },
})