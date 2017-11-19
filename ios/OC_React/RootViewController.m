//
//  RootViewController.m
//  OC_React
//
//  Created by 张征鸿 on 2017/9/15.
//  Copyright © 2017年 张征鸿. All rights reserved.
//

#import "RootViewController.h"
#import "ReactViewController.h"
@interface RootViewController ()

@property (weak, nonatomic) IBOutlet UIButton *button;

@end

@implementation RootViewController
- (IBAction)buttonAction:(id)sender
{
    ReactViewController *react = [ReactViewController new];
    [self.navigationController pushViewController:react animated:true];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
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
