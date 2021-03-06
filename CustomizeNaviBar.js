/**
 * Created by zhangzhenghong on 2017/11/17.
 */
import React, { Component } from 'react';
import PLSectionHeaderView from './PLSectionHeaderView'
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableHighlight,
} from 'react-native';
import {
    mapDispatchProps,
    mapToState
} from './DataManager/ReduxManager'
import {
    connect,
} from 'react-redux'


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

    _sectionHeader(section){
        return(
            <SectionHeader ref={(header)=>this._sectionHeaderView=header}
                                 style={styles.bannerStyle}>

            </SectionHeader>
        )
    }


    render(){
        return(
            <View style={styles.customizeNavibarStye} ref={(vi)=>this._vi=vi}>
                <View style={styles.containViewStyle}>
                    <View style={{left: 10}}>
                        <Image style={{
                            width:40,
                            height:40,
                            borderRadius: 20,
                        }} source={require('./Image/1.jpg')}/>
                    </View>
                    {this._sectionHeader()}
                </View>
            </View>
            // {/*<View style={styles.customizeNavibarStye} ref={(vi)=>this._vi=vi}>*/}
            //     {/*<View style={styles.containViewStyle}>*/}
            //         {/*<View style={styles.titleContainViewStyle}>*/}
            //             {/*<Text style={styles.titleStyle}>*/}
            //                 {/*Main*/}
            //             {/*</Text>*/}
            //         {/*</View>*/}
            //     {/*</View>*/}
            // {/*</View>*/}
        )
    }
}

const SectionHeader = connect(
    mapToState,
    mapDispatchProps,
)(PLSectionHeaderView)

const kScreenWidth = Dimensions.get('window').width
const kScreenHeight = Dimensions.get('window').height
const naviBarHeight = (kScreenHeight>=812?88:64)
const statusBarHeight = (kScreenHeight>=812?44:20)

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
        left:0,
        right:0,
        bottom:0,
        top:statusBarHeight,
        flexDirection:'row',
        alignItems:'center'
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

    bannerStyle:{
        // position:'absolute',
        top:20,
        width:375,
        height:40,
        bottom:0,
    }
})