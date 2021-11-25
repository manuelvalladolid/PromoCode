// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { Utilities } from '../../services/utilities';
import { AccountService } from 'src/app/services/account.service';



@Component({
  selector: 'app-todo-demo',
  templateUrl: './todo-demo.component.html',
  styleUrls: ['./todo-demo.component.scss']
})
export class TodoDemoComponent implements OnInit, OnDestroy {
  public static readonly DBKeyTodoDemo = 'todo-demo.todo_list';

  rows = [];
  rowsCache = [];
  columns = [];
  editing = {};
  taskEdit: any = {};
  isDataLoaded = false;
  loadingIndicator = true;
  formResetToggle = true;
  _currentUserId: string;
  _hideCompletedTasks = false;


  get currentUserId() {
    if (this.authService.currentUser) {
      this._currentUserId = this.authService.currentUser.id;
    }

    return this._currentUserId;
  }


  set hideCompletedTasks(value: boolean) {

    if (value) {
      this.rows = this.rowsCache.filter(r => !r.completed);
    } else {
      this.rows = [...this.rowsCache];
    }


    this._hideCompletedTasks = value;
  }

  get hideCompletedTasks() {
    return this._hideCompletedTasks;
  }


  @Input()
  verticalScrollbar = false;


  @ViewChild('statusHeaderTemplate', { static: true })
  statusHeaderTemplate: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  statusTemplate: TemplateRef<any>;

  @ViewChild('nameTemplate', { static: true })
  nameTemplate: TemplateRef<any>;

  @ViewChild('descriptionTemplate', { static: true })
  descriptionTemplate: TemplateRef<any>;

  @ViewChild('estadoTemplate', { static: true })
  estadoTemplate: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate: TemplateRef<any>;

  @ViewChild('editorModal', { static: true })
  editorModal: ModalDirective;


  constructor(private promoCode: AccountService,
    private alertService: AlertService, private translationService: AppTranslationService, private localStorage: LocalStoreManager, private authService: AuthService) {
  }



  ngOnInit() {
    this.loadingIndicator = false;
    this.getList();
    // this.fetch((data) => {
    //   this.refreshDataIndexes(data);
    //   this.rows = data;
    //   this.rowsCache = [...data];
    //   this.isDataLoaded = true;

    //   setTimeout(() => { this.loadingIndicator = false; }, 1500);
    // });


    const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: 'idPromoCode', name: 'Código', cellTemplate: this.nameTemplate, width: 500 },
      { prop: 'nombre', name: 'Nombre', cellTemplate: this.nameTemplate, width: 200 },
      { prop: 'email', name: 'Email', cellTemplate: this.descriptionTemplate, width: 200 },
      { prop: 'estado', name: 'Estado', cellTemplate: this.estadoTemplate, width: 200 },
      { prop: '', name: '', cellTemplate: this.actionsTemplate, width: 200 },
    ];
  }

  ngOnDestroy() {
    this.saveToDisk();
  }

  getList() {
  this.promoCode.getList().subscribe(s => this.rows = s.data);
  }

  addPromo() {
    let promo = {
      nombre : this.taskEdit.name,
      email : this.taskEdit.description,
    }
    this.promoCode.addPromoCode(promo).subscribe(s => {
      if(s.data == false){
        this.alertService.showMessage("El email ya esta registrado!", '', 3);
      }else{
        console.log(s), this.getList();
      }
      
    });
  }

  canjear(row) {
    this.promoCode.updatePromoCode(row.idPromoCode).subscribe(s => {console.log(s), this.getList();});
  }

  fetch(cb) {
    let data = this.getFromDisk();

    if (data == null) {
      setTimeout(() => {

        data = this.getFromDisk();

        if (data == null) {
          data = [
            { completed: true, important: true, name: 'Create visual studio extension', description: 'Create a visual studio VSIX extension package that will add this project as an aspnet-core project template' },
            { completed: false, important: true, name: 'Do a quick how-to writeup', description: '' },
            {
              completed: false, important: false, name: 'Create aspnet-core/Angular tutorials based on this project', description: 'Create tutorials (blog/video/youtube) on how to build applications (full stack)' +
                ' using aspnet-core/Angular. The tutorial will focus on getting productive with the technology right away rather than the details on how and why they work so audience can get onboard quickly.'
            },
          ];
        }

        cb(data);
      }, 1000);
    } else {
      cb(data);
    }
  }


  refreshDataIndexes(data) {
    let index = 0;

    for (const i of data) {
      i.$$index = index++;
    }
  }


  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r =>
      Utilities.searchArray(value, false, r.name, r.description) ||
      value === 'important' && r.important ||
      value === 'not important' && !r.important);
  }


  showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }


  addTask() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;

      this.taskEdit = {};
      this.editorModal.show();
    });
  }

  save() {

    this.addPromo();
    // this.rowsCache.splice(0, 0, this.taskEdit);
    // this.rows.splice(0, 0, this.taskEdit);
    // this.refreshDataIndexes(this.rowsCache);
    // this.rows = [...this.rows];

    // this.saveToDisk();
    this.editorModal.hide();
  }


  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index + '-' + cell] = false;
    this.rows[row.$$index][cell] = event.target.value;
    this.rows = [...this.rows];

    this.saveToDisk();
  }


  delete(row) {
    this.alertService.showDialog('Are you sure you want to delete the task?', DialogType.confirm, () => this.deleteHelper(row));
  }


  deleteHelper(row) {
    this.rowsCache = this.rowsCache.filter(item => item !== row);
    this.rows = this.rows.filter(item => item !== row);

    this.saveToDisk();
  }

  getFromDisk() {
    return this.localStorage.getDataObject(`${TodoDemoComponent.DBKeyTodoDemo}:${this.currentUserId}`);
  }

  saveToDisk() {
    if (this.isDataLoaded) {
      this.localStorage.saveSyncedSessionData(this.rowsCache, `${TodoDemoComponent.DBKeyTodoDemo}:${this.currentUserId}`);
    }
  }
}
