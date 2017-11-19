/**
 * Created by zhangzhenghong on 2017/11/10.
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper';

var styles = StyleSheet.create({
    wrapper: {
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    pageControlStyle: {
        bottom : 5,
    },

})

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default class PLBanner extends React.Component
{

    constructor(props){
        super(props)

        this.state = {
            dataSourceArr : props.dataSourceArr,
        }
        console.log('Banner DataSource = ' + props.dataSourceArr)
    }

    componentDidMount(){

    }

    _dataHandle = (dataArr)=> {
        var controlArr = []
        for (var i = 0; i < dataArr.length; i++) {
            var model = dataArr[i]
            controlArr.push(
                //数组顶层元素要有个唯一的key值
                <View style={styles.slide1} key={i}>
                    <Image
                        style={{width:screenWidth,height:200}}
                        resizeMode='contain'
                        source={{uri:model.image}}
                    />
                </View>
            )
        }
        return controlArr
    }

    render(){
        var arr = this.state.dataSourceArr
        return(
                <Swiper style={styles.wrapper} showsButtons={false} height={screenWidth * 1 / 3.2}
                        autoplay={true}
                        paginationStyle={styles.pageControlStyle}
                        activeDotColor='#ffffff'
                >
                    {this._dataHandle(arr)}
                </Swiper>
        )
    }
}
