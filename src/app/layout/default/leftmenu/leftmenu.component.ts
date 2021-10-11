import { Component } from '@angular/core';

@Component({
  selector: 'layout-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.less'],
})
export class LeftmenuComponent {
  public toggleable: boolean = false;
  public elementId: string = 'leftmenu';
  public collapsed: boolean = false; // 默认展开，当设置为true时会收起
  public reloadState: boolean = true; // 初始设置为true
}
