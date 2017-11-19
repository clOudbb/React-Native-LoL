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
    TouchableHighlight
} from 'react-native';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default class PLSectionHeaderView extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            dataSourceArr : ['最新', '专栏', '官方', '活动', '攻略','娱乐','收藏'],
            bottomLineControlArr : {'0': true, '1':false, '2': false, '3': false, '4' : false, '5':false,'6':false},
        }
        console.log('PLSectionHeaderV Data = ' + this.state.dataSourceArr)
    }
    componentDidMount(){

    }

    _touchAction(index) {
        var dic = this.state.bottomLineControlArr
        for (var i = 0;i < Object.keys(dic).length;i++){
            if (i == index) {
                dic[index] = true
            } else {
                dic[i] = false
            }
        }
        this.setState({
            bottomLineControlArr:dic
        })
    }


    _renderItem(item, index){
        // console.log('touch index = ' + index)
        return(
            <TouchableHighlight style={{flex:1}}
                                onPress={()=>this._touchAction(index)}>
                <View style={styles.textContainView}>
                    <Text style={styles.textLabelStyle}>{item}</Text>
                    {
                        !this.state.bottomLineControlArr[index]?null:<View style={styles.bottomLineStyle}></View>
                    }
                </View>
            </TouchableHighlight>
        )
    }

    render(){
        return(
            <SectionList
                style = {styles.sectionListStyle}
                sections = {[{data:this.state.dataSourceArr}]}
                renderItem={({item, index}) => this._renderItem(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}

                //contentInset={{top:0,left:0,bottom:0,right:screenWidth / 4 * 3}}// 设置他的滑动范围
                //contentContainerStyle={styles.textContainView}
            >

            </SectionList>
        )
    }
}

var styles = StyleSheet.create({
    sectionListStyle: {
        height:40,
        backgroundColor:'#ffffff',
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