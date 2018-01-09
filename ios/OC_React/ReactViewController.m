//
//  ReactViewController.m
//  OC_React
//
//  Created by 张征鸿 on 2017/9/15.
//  Copyright © 2017年 张征鸿. All rights reserved.
//

#import "ReactViewController.h"
#import <React/RCTRootView.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTImageView.h>
#if __has_include(<React/RCTViewManager.h>)
#import <React/RCTViewManager.h>
#else // back compatibility for RN version < 0.40
#import "RCTViewManager.h"
#endif
@interface ReactViewController ()<RCTBridgeModule>

@property (nullable, nonatomic, strong) RCTRootView *rootView;

@end

@implementation ReactViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    if (self.navigationController) {
        self.navigationController.interactivePopGestureRecognizer.enabled = false;
    }
    
    [self.view addSubview:self.rootView];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(dismiss) name:@"123" object:nil];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"123" object:nil];
}

- (void)dismiss
{
    if (self.navigationController) {
        [self.navigationController popViewControllerAnimated:true];
    } else {
        [self dismissViewControllerAnimated:true completion:nil];
    }
}

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(dismiss:(NSString *)string)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] postNotificationName:@"123" object:nil];
    });
}
static NSString * const _localHost = @"http://localhost:8088/index.ios.bundle?platform=ios&dev=true";
static NSString * const _ipHost = @"http://172.18.3.117:8088/index.ios.bundle?platform=ios&dev=true";
- (RCTRootView *)rootView
{
    if (!_rootView) {
        NSURL *jsCodeLocation = [NSURL
                                 URLWithString:_localHost];
        _rootView =  [[RCTRootView alloc] initWithBundleURL : jsCodeLocation
                             moduleName        : @"OC_React"
                             initialProperties :
         @{
           @"scores" : @[
                   @{
                       @"name" : @"Alex",
                       @"value": @"42"
                       },
                   @{
                       @"name" : @"Joel",
                       @"value": @"10"
                       }
                   ]
           }
                              launchOptions    : nil];
        _rootView.frame = self.view.bounds;
    }
    return _rootView;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
