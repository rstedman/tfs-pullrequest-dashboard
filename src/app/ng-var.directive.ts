import { Component, Directive, Input, NgModule, TemplateRef, ViewContainerRef } from "@angular/core";

// source: https://stackoverflow.com/a/43172992
@Directive({
    selector: "[ngVar]",
})
export class VarDirective {
  @Input()
  public set ngVar(context: any) {
    this.context.$implicit = this.context.ngVar = context;
    this.updateView();
  }

  public context: any = {};

  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

  public updateView() {
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.templateRef, this.context);
  }
}
