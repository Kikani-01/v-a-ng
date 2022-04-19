import {Roles} from './common/authentication/permissions';
import {AuthService} from './services/auth.service';
import {PAGES} from './constants/pages';
import {APP_VERSION} from './constants/constants';
import {Component} from '@angular/core';
import {User} from './models/user';
import {KeycloakService} from 'keycloak-angular';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = `(${APP_VERSION})`;

    public pages = PAGES;
    sidebarState = 'sidebar close';
    user: User;
    languages: string[] = ['it', 'en'];
    selectedLanguage: string;

    primaryRole: string;
    updateVisible: boolean;
    mobile: boolean;

    constructor(
        public userService: AuthService,
        public keycloak: KeycloakService,
        private primengConfig: PrimeNGConfig,
        public translateService: TranslateService
    ) {
        this.initializeTranslate();
    }

    public update(): void {
        window.location.reload();
    }

    ngOnInit(): void {
        this.keycloak.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                this.keycloak.getToken().then(token => {
                    this.userService.createUser(token);
                    this.user = this.userService.getUser();
                    this.setPrimaryRole();
                });
            }
        });

        this.sidebarState = `sidebar ${localStorage.getItem('sidebar') ?? 'close'}`;
    }

    initializeTranslate(): void {
        this.translateService.addLangs(this.languages);
        this.translateService.setDefaultLang('it');

        this.selectedLanguage = localStorage.getItem('lang') || 'it';

        // const browserLang = this.translateService.getBrowserLang();
        // let lang = browserLang.match(/en|it/) ? browserLang : 'it';
        this.changeLang(this.selectedLanguage, true);
    }

    changeLang(lang: string, initial?: boolean) {
        this.translateService.use(lang);
        localStorage.setItem('lang', lang);

        this.translateService.get('primeng').subscribe({
            next: res => this.primengConfig.setTranslation(res),
            error: err => console.log('Error translate service get method', err),
            complete: () => !initial && window.location.reload(),
        });
    }

    toggleNav() {
        if (localStorage.getItem('sidebar') === 'open') {
            this.sidebarState = 'sidebar close';
            localStorage.setItem('sidebar', 'close');
        } else {
            this.sidebarState = 'sidebar open';
            localStorage.setItem('sidebar', 'open');
        }
    }

    private setPrimaryRole(): void {
        if (this.primaryRole) {
            return;
        }

        if (this.user && this.user.roles) {
            if (this.user.roles.includes(Roles.Admin)) {
                this.primaryRole = Roles.Admin;
                return;
            }
            if (this.user.roles.includes(Roles.User)) {
                this.primaryRole = Roles.User;
                return;
            }
        }
    }

    logout(): void {
        this.user = new User();
        this.userService.clearUser();
        this.keycloak.logout();
    }
}
