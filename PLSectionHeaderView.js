/**
 * Created by zhangzhenghong on 2017/11/13.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SectionList,
    TouchableHighlight,
    ScrollView,
    Animated
} from 'react-native';
import {kTouchBannerNotification, kContainScrollViewScroll} from './RemoteManager'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter' ;

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const naviBarHeight = (screenHeight>=812?88:64)
const _animLineLeft = 15
export default class PLSectionHeaderView extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            dataSourceArr : ['最新', '季前赛','英雄', '视频', '专栏'],
            bottomLineControlArr : {'0': true, '1':false, '2': false, '3': false, '4' : false},
            _changedHeaderView:false,
            _linePositionX : new Animated.Value(_animLineLeft),
        }
        console.log('PLSectionHeaderV Data = ' + this.state.dataSourceArr)
    }

    componentDidMount(){
        this.noti = RCTDeviceEventEmitter.addListener(kContainScrollViewScroll, (index)=>{
            this._touchAction(index)
        })
    }

    componentWillUnmount() {
        this.noti.remove()
    }

    _touchAction(index) {
        var dic = this.state.bottomLineControlArr
        let value = 0;
        for (let i = 0;i < Object.keys(dic).length;i++){
            if (i == index) {
                dic[index] = true
                value = index
                RCTDeviceEventEmitter.emit(kTouchBannerNotification, index)
            } else {
                dic[i] = false
            }
        }
        Animated.timing(this.state._linePositionX,{
            toValue: value * screenWidth / 4 + _animLineLeft,
            duration:350,  //时间是毫秒
        }).start()
        this.setState({
            bottomLineControlArr:dic
        })
    }

    _setNativeProps(offsetY){
        //这里需要加个判断优化，不应该一直执行
        //但是目前加入的判断效果都不是很好，由于React这里判定比较麻烦。
        //sectionList header的top判定不会计算ListHeaderCompoent在内
        //最好使用react-navigation原生的navi就可以使用sectionList自带的悬浮效果
        //但是目前对react-navigation的理解无法对navibar进行高度自定义（渐变），
        //所以采用了自定义navibar
        //需要以后更深理解来解决这里的优化问题
        let z_offSet = offsetY
        this._list.setNativeProps({
            style:{top : z_offSet}
        })
        // if (z_offSet === 44 && this.state._changedHeaderView === false)
        // {
        //     this._list.setNativeProps({
        //         style:{top : z_offSet}
        //     })
        //     this.setState({
        //         _changedHeaderView:true,
        //     })
        // }
        // else if (z_offSet < 44 && this.state._changedHeaderView === true)
        // {
        //     this._list.setNativeProps({
        //         style:{top : z_offSet}
        //     })
        // }
        // else if (z_offSet < 44 && this.state._changedHeaderView === false)
        // {
        //     this._list.setNativeProps({
        //         style:{top : z_offSet}
        //     })
        // }
        // else if (z_offSet === 0)
        // {
        //     this._list.setNativeProps({
        //         style:{top : z_offSet}
        //     })
        //     this.setState({
        //         _changedHeaderView:false,
        //     })
        // }

    }


    _renderItem(){
        var itemArr = new Array()
        let arr = this.state.dataSourceArr
        for (let index = 0; index < arr.length;index++)
        {
            let item = arr[index]
            itemArr.push(
                <TouchableHighlight style={{flex:1}}
                                    onPress={()=>this._touchAction(index)} key={index}>
                    <View style={styles.textContainView}>
                        <Text style={styles.textLabelStyle}>{item}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return itemArr
    }

    render(){
        return(

            <ScrollView style = {styles.sectionListStyle}
                        // sections = {[{data:this.state.dataSourceArr}]}
                        // renderItem={({item, index}) => this._renderItem(item, index)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ref={list=>this._list=list}>
                {
                    this._renderItem()
                }
                <Animated.View style={{
                    backgroundColor:'red' ,
                    height:2,
                    width:screenWidth / 4 - 30,
                    position:'absolute',
                    left:this.state._linePositionX,
                    bottom:0,
                }}>
                </Animated.View>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({
    sectionListStyle: {
        height:40,
        backgroundColor:'white',
        marginTop:0,
        marginRight:0,
        marginLeft:0,
        marginBottom:0,
    },

    contentContainerStyle: {
        flex:1,
        height:40,
        backgroundColor:'#ffffff',
        flexDirection:'row',
        alignItems:'center',
    },

    textContainView: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        width:screenWidth / 4,
        height:40,
        backgroundColor:'#ffffff',
        flexDirection:'column',
    },
    textLabelStyle: {
        textAlign: 'center',
    },
    bottomLineStyle: {
        backgroundColor:'red' ,
        height:2,
        width:screenWidth / 4 - 30,
        position:'absolute',
        bottom:0,
    }
})