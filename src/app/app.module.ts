import { Attachment } from './models/attachment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeIt from '@angular/common/locales/it';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { keycloakConfig } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchTagsComponent } from './common/components/search-tags.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { Permit } from './directives/permit.directive';
import { HomePageComponent } from './components/home/home.component';
import { CompanyService } from './services/company.service';
import { VisitorService } from './services/visitor.service';
import { OutputPrintable } from './pipes/output-printable.pipe';
import { UserViewComponent } from './components/user/user-view.component';
import { VisitorViewComponent } from './components/visitor/visitor-view.component';
import { UserVerificationComponent } from './components/user/user-verification.component';
import { CompaniesListComponent } from './components/companies/companies-list.component';
import { VisitorsListComponent } from './components/visitor/visitor-list.component';
import { OutputDateTimePipe } from './pipes/output-date-time.pipe';
import { OutputDatePipe } from './pipes/output-date.pipe';
import { CompanyEditComponent } from './components/companies/company-edit.component';
import { CompanyViewComponent } from './components/companies/company-view.component';
import { AttachmentEditComponent } from './components/attachment/attachment-edit.component';
import { AttachmentViewComponent } from './components/attachment/attachment-view.component';
import { AttachmentListComponent } from './components/attachment/attachment-list.component';
import { VisitorsEditComponent } from './components/visitor/visitor-edit.component';
import { UserEditComponent } from './components/user/user-edit.component';
import { UserListComponent } from './components/user/user-list.component';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SafePipeModule } from 'safe-pipe';
import { CheckboxModule } from 'primeng/checkbox';
import { AttachmentService } from './services/attachment.service';


export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
    return () =>
        keycloak.init({
            config: keycloakConfig,
            bearerExcludedUrls: [],
            initOptions: {
                checkLoginIframe: true,
                checkLoginIframeInterval: 25,
            },
            loadUserProfileAtStartUp: true,
        });
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        OutputDateTimePipe,
        OutputDatePipe,
        OutputPrintable,
        Permit,
        SearchTagsComponent,
        CompaniesListComponent,
        CompanyEditComponent,
        CompanyViewComponent,
        BackButtonDirective,
        UserEditComponent,
        UserListComponent,
        UserViewComponent,
        UserVerificationComponent,
        VisitorsListComponent,
        VisitorsEditComponent,
        VisitorViewComponent,
        AttachmentListComponent,
        AttachmentEditComponent,
        AttachmentViewComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        KeycloakAngularModule,
        ReactiveFormsModule,
        TableModule,
        DropdownModule,
        ConfirmDialogModule,
        AutoCompleteModule,
        CalendarModule,
        CardModule,
        ChipsModule,
        DialogModule,
        GalleriaModule,
        PaginatorModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        MessageModule,
        MessagesModule,
        OverlayPanelModule,
        SidebarModule,
        StepsModule,
        ProgressBarModule,
        TableModule,
        TooltipModule,
        FormsModule,
        ToastModule,
        NgxDocViewerModule,
        SafePipeModule,
        FileUploadModule,
        ButtonModule,
        MonacoEditorModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        CheckboxModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService],
        },
        { provide: LOCALE_ID, useValue: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en-US' },
        MessageService,
        ConfirmationService,
        TranslateModule,
        CompanyService,
        VisitorService,
        AttachmentService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        registerLocaleData(localeIt, 'it');
    }
}
