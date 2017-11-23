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

var styles = StyleSheet.create({
    wrapper: {
        backgroundColor:'white'
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
    },
    slide3: {
        position:'absolute',
        marginTop:0,
        marginBottom:0,
        marginLeft:50,
        marginRight:50,
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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const kBannerViewHeight = screenWidth * 1 / 2.1;

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
            //这里注意ES5的循环体问题，可以用如下方法解决，或者使用es6的 let来接收 model url i
            //注意Image网络图片必须指定w h
            var push = (i, model, url)=>{

                controlArr.push(
                    <TouchableHighlight style={styles.slide2} onPress={()=>this.props._onPress(i, url)}  key={i}>
                        <View style={styles.slide1}>
                            <Image
                                style={{width:screenWidth,height:200}}
                                resizeMode='cover'
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
                <Swiper style={styles.wrapper} showsButtons={false} height={kBannerViewHeight}
                        autoplay={true}
                        paginationStyle={styles.pageControlStyle}
                        activeDotColor='#ffffff'
                >
                    {this._dataHandle(arr)}
                </Swiper>
        )
    }
}
