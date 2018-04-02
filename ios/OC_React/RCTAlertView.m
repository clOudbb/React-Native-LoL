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
        _view = [UIView new];
    }
    return _view;
}


@end
