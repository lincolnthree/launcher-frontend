import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgeService } from './forge.service'
import { Gui, Input, ProjectSettings, Message } from './model';

@Component({
  selector: 'wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [
    ProjectSettings
  ]
})
export class FormComponent {
  currentGui: Gui = new Gui();

  constructor(
    private router: Router,
    private forgeService: ForgeService,
    private settings: ProjectSettings) {
    this.forgeService.commandInfo().then((gui) => {
      this.currentGui = gui;
      this.currentGui.messages = [];
    });
  }

  getInputType(input: Input):string {
    if (input.valueType == 'java.lang.String') {
      return 'text';
    } else if (input.valueType == 'java.lang.Boolean') {
      return 'checkbox';
    }
    return 'text';
  }

  changed(form: NgForm) {
    if (form.dirty && form.valid) {
      this.forgeService.validate(this.currentGui).then(gui => this.currentGui = gui)
        .catch(error => this.currentGui.messages.push(new Message(error)));
    }
  }

  next() {
    this.forgeService.nextStep(this.currentGui).then(gui => this.currentGui = gui)
      .catch(error => this.currentGui.messages.push(new Message(error)));
  }

  onSubmit() {
    this.forgeService.executeCommand(this.currentGui).then(gui => this.currentGui = gui)
      .catch(error => this.currentGui.messages.push(new Message(error)));
  }

  closeAlert(error: Message) {
    error.showError = true;
  }
}