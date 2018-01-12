/**
 * Created by zhangzhenghong on 2018/1/12.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export class LOLMineTipImage extends React.Component
{
    static propTypes = {
        content : PropTypes.string,
        style: PropTypes.object,
    }

    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){

    }

    _renderItem = (content) => {
        return (
            <View style={this.props.style}>
                <Text style={styles.textLayout} numberOfLines={1}>{content}</Text>
            </View>
        )
    }

    render(){
        return(
            this._renderItem(this.props.content)
        )
    }
}

const naviBarHeight = (kScreenHeight>=812?88:64)
const tabBarHeight = (kScreenHeight>=812?83:49)
const cellMargin = 10;
const tableViewTop = (kScreenHeight>=812?44:0)
const statusBarHeight = (kScreenHeight>=812?44:20)
const styles = StyleSheet.create({


    textLayout:{
        fontSize:15,
    },


});