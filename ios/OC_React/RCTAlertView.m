//
//  RCTAlertView.m
//  OC_React
//
//  Created by 张征鸿 on 2018/4/2.
//  Copyright © 2018年 张征鸿. All rights reserved.
//

#import "RCTAlertView.h"

@implementation RCTAlertView
{
    UIView * _view;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
    if (!_view) {
        //contain view 可以不设置其他，因为react 中style会对contain view本身产生改变，所以可以oc里可以不设置
        _view = [UIView new];
        
        //子控件可以在初始化写好，如果js里要改变需要暴露额外接口或属性配置
        UIView *child = [UIView new];
        child.backgroundColor = [UIColor blueColor];
        child.frame = (CGRect){10, 10, 50, 50};
        [_view addSubview:child];
    }
    return _view;
}


@end
