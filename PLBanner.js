/**
 * Created by zhangzhenghong on 2017/11/10.
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper';
import TouchableItem from "react-navigation/src/views/TouchableItem";

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
            var url = model.article_url
            console.log(''+ url + '\n i=' + i);
            //这里注意ES5的循环体问题，可以用如下方法解决，或者使用es6的 let来接收 model url
            var push = (i, model, url)=>{

                controlArr.push(
                    <TouchableHighlight style={{flex:1,}} onPress={()=>this.props._onPress(i, url)}  key={i}>
                        <View style={styles.slide1}>
                            <Image
                                style={{width:screenWidth,height:200}}
                                resizeMode='contain'
                                source={{uri:model.image_url_big}}
                            />
                        </View>
                    </TouchableHighlight>
                )
                
            }
            push(i, model, url)

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
